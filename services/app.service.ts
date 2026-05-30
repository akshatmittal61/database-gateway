import { HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { appRepo } from "@/repo";
import { ApiRequests, ApiResponses, AppInfo, IApp, IUpdateApp } from "@/types";
import { AppUtils } from "@/utils";

export class AppService {
	// Strip apiKeyHash before returning to any caller outside this service.
	// This is the single choke-point — no hash ever leaves the service layer.
	private static toSafe(app: IApp): AppInfo {
		const { apiKeyHash: _, apiKeyPrefix: __, ...safe } = app;
		return safe;
	}

	// ─── User-facing CRUD ─────────────────────────────────────────────

	public static async createApp(
		userId: string,
		body: ApiRequests.CreateApp
	): Promise<ApiResponses.CreateApp> {
		const existing = await appRepo.findByIdentifier(body.identifier);
		if (existing) {
			throw new ApiError(
				HTTP.status.CONFLICT,
				HTTP.message.APP_IDENTIFIER_TAKEN
			);
		}

		const { fullKey, prefix, hash } = AppUtils.generateApiKey(
			body.identifier
		);

		const createBody: ApiRequests.CreateApp = {
			author: userId,
			name: body.name,
			identifier: body.identifier,
			apiKeyPrefix: prefix,
			apiKeyHash: hash,
			origins: body.origins ?? [],
			allowedDbs: body.allowedDbs ?? [],
			description: body.description ?? "",
			lastUsedAt: new Date().toISOString(),
		};

		const app = await appRepo.create(createBody);
		// fullKey returned once — caller must store it
		return { ...AppService.toSafe(app), apiKey: fullKey };
	}

	public static async getAllApps(
		userId: string
	): Promise<ApiResponses.GetAllApps> {
		const apps = await appRepo.findByUserId(userId);
		return apps.map(AppService.toSafe);
	}

	public static async getApp(
		identifier: string,
		userId: string
	): Promise<ApiResponses.GetApp> {
		const app = await appRepo.findByIdentifierAndUserId(identifier, userId);
		if (!app) {
			// Deliberately vague — don't leak whether identifier exists
			// but belongs to someone else
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				HTTP.message.APP_NOT_FOUND
			);
		}
		return AppService.toSafe(app);
	}

	public static async updateApp(
		identifier: string,
		userId: string,
		body: IUpdateApp
	): Promise<ApiResponses.UpdateApp> {
		const app = await appRepo.findByIdentifierAndUserId(identifier, userId);
		if (!app) {
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				HTTP.message.APP_NOT_FOUND
			);
		}
		const updated = await appRepo.update({ identifier }, body);
		if (!updated) {
			throw new ApiError(
				HTTP.status.INTERNAL_SERVER_ERROR,
				HTTP.message.ERROR
			);
		}
		return AppService.toSafe(updated);
	}

	public static async deleteApp(
		identifier: string,
		userId: string
	): Promise<ApiResponses.DeleteApp> {
		const app = await appRepo.findByIdentifierAndUserId(identifier, userId);
		if (!app) {
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				HTTP.message.APP_NOT_FOUND
			);
		}
		const deleted = await appRepo.remove({ identifier });
		if (!deleted) {
			throw new ApiError(
				HTTP.status.INTERNAL_SERVER_ERROR,
				HTTP.message.ERROR
			);
		}
		return AppService.toSafe(deleted);
	}

	// ─── Key rotation ─────────────────────────────────────────────────

	public static async rotateKey(
		identifier: string,
		userId: string
	): Promise<ApiResponses.RotateKey> {
		const app = await appRepo.findByIdentifierAndUserId(identifier, userId);
		if (!app) {
			throw new ApiError(
				HTTP.status.NOT_FOUND,
				HTTP.message.APP_NOT_FOUND
			);
		}

		const { fullKey, prefix, hash } = AppUtils.generateApiKey(identifier);

		await appRepo.update({ identifier }, {
			apiKeyPrefix: prefix,
			apiKeyHash: hash,
		} as any);

		// New fullKey returned once — old key is immediately invalid
		return { identifier, apiKey: fullKey };
	}

	// ─── Gateway verification path ────────────────────────────────────

	/**
	 * Verify an incoming API key from a gateway request.
	 * Returns the app (without hash) if valid, null if invalid.
	 * Called by AppAuthMiddleware on every /gateway/* request.
	 */
	public static async verifyAppKey(
		incomingKey: string
	): Promise<IApp | null> {
		const identifier = AppUtils.parseKeyIdentifier(incomingKey);
		if (!identifier) return null;

		const prefix = `dgw_${identifier}_`;
		const appWithHash = await appRepo.findByPrefixWithHash(prefix);
		if (!appWithHash) return null;

		const incomingHash = AppUtils.hashApiKey(incomingKey);
		if (!AppUtils.timingSafeCompare(incomingHash, appWithHash.apiKeyHash)) {
			return null;
		}

		return AppService.toSafe(appWithHash) as IApp;
	}

	// ─── Post-query bookkeeping ───────────────────────────────────────

	/** Fire-and-forget lastUsedAt update. Never throws. */
	public static async touchLastUsed(identifier: string): Promise<void> {
		try {
			await appRepo.update(
				{ identifier },
				{ lastUsedAt: new Date().toISOString() }
			);
		} catch {
			// Non-critical — do not propagate
		}
	}
}
