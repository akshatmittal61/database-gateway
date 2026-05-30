import { AppModel } from "@/models";
import { App, CreateModel, IApp, IUser, UpdateModel } from "@/types";
import { getObjectFromMongoResponse, SafetyUtils } from "@/utils";
import { BaseRepo } from "./base";
import { FilterQuery } from "mongoose";

class AppRepo extends BaseRepo<App, IApp> {
	protected model = AppModel;

	public parser(input: App | null): IApp | null {
		const res = super.parser(input);
		if (!res) return null;
		const author = getObjectFromMongoResponse<IUser>(res.author);
		if (SafetyUtils.isNonNull(author)) {
			res.author = author;
		}
		return res;
	}

	public async findOne(query: FilterQuery<App>): Promise<IApp | null> {
		const res = await this.model.findOne<App>(query).populate("author");
		return this.parser(res);
	}

	public async findById(id: string): Promise<IApp | null> {
		try {
			const res = await this.model.findById<App>(id).populate("author");
			return this.parser(res);
		} catch (error: any) {
			if (error.kind === "ObjectId") return null;
			throw error;
		}
	}

	public async find(query: FilterQuery<App>): Promise<Array<IApp> | null> {
		const res = await this.model.find<App>(query).populate("author");
		const parsedRes = res.map(this.parser).filter((obj) => obj != null);
		if (parsedRes.length === 0) return null;
		return parsedRes;
	}

	public async findAll(): Promise<Array<IApp>> {
		const res = await this.model
			.find<App>()
			.sort({ createdAt: -1 })
			.populate("author");
		const parsedRes = res.map(this.parser).filter((obj) => obj != null);
		if (parsedRes.length > 0) return parsedRes;
		return [];
	}

	public async create(body: CreateModel<App>): Promise<IApp> {
		const res = await this.model.create<CreateModel<App>>(body);
		return SafetyUtils.getNonNullValue(
			this.parser(await res.populate("author"))
		);
	}

	public async update(
		query: FilterQuery<App>,
		update: UpdateModel<App>
	): Promise<IApp | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndUpdate<App>(filter, update, { new: true })
			.populate("author");
		return this.parser(res);
	}

	public async remove(query: FilterQuery<App>): Promise<IApp | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndDelete<App>(filter)
			.populate("author");
		return this.parser(res);
	}

	/** Find app by its unique identifier slug */
	public async findByIdentifier(identifier: string): Promise<IApp | null> {
		return this.findOne({ identifier });
	}

	/** Find all apps owned by a user */
	public async findByUserId(userId: string): Promise<IApp[]> {
		return (await this.find({ userId })) ?? [];
	}

	/** Find app by identifier AND userId — used to enforce ownership */
	public async findByIdentifierAndUserId(
		identifier: string,
		userId: string
	): Promise<IApp | null> {
		return this.findOne({ identifier, userId });
	}

	/**
	 * Find app by apiKeyPrefix, WITH the apiKeyHash included.
	 * apiKeyHash is select:false in the schema — must be explicitly requested.
	 * Used ONLY during key verification in AppAuthMiddleware.
	 */
	public async findByPrefixWithHash(
		prefix: string
	): Promise<(IApp & { apiKeyHash: string }) | null> {
		const res = await this.model
			.findOne({ apiKeyPrefix: prefix })
			.select("+apiKeyHash")
			.lean();
		if (!res) return null;
		return this.parser(res) as (IApp & { apiKeyHash: string }) | null;
	}
}

export const appRepo = AppRepo.getInstance<AppRepo>();
