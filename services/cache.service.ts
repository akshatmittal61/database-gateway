import { Cache } from "@/cache";
import { cacheParameter, TTL_SECONDS } from "@/constants";
import { InvalidDataFormatException } from "@/errors";
import { Logger } from "@/log";
import { CacheParameter, CachePayloadGenerator, IUser } from "@/types";
import { SafetyUtils } from "@/utils";

export class CacheService {
	/**
	 * Fetches a value from the cache by key,
	 * or executes a callback to retrieve the value if it's not cached
	 * and stores it in the cache for the specified time-to-live.
	 *
	 * @param {string} key - The cache key to fetch the value for.
	 * @param {() => Promise<T>} callback - A callback function to execute if the value is not cached.
	 * @param {number} ttl - The time-to-live for the cache entry in seconds.
	 * @return {Promise<T>} The cached or newly retrieved value.
	 */
	public static async fetch<T>(
		key: string,
		callback: () => Promise<T>,
		ttl: number = TTL_SECONDS
	): Promise<T> {
		if (key.length > 0 && key !== "undefined" && key !== "null") {
			const cachedValue = Cache.get<T>(key);
			if (cachedValue) {
				Logger.debug(`Cache hit for ${key}`);
				return cachedValue;
			}
			Logger.debug(`Cache miss for ${key}`);
			const newValue = await callback();
			Cache.set<T>(key, newValue, ttl);
			return newValue;
		} else {
			return callback();
		}
	}

	public static getKey<T extends CacheParameter>(
		parameter: T,
		data: CachePayloadGenerator<T>
	): string {
		if (parameter === cacheParameter.USER) {
			const payload = data as CachePayloadGenerator<"USER">;
			if ("id" in payload) {
				return `user:${payload.id}`;
			} else if ("email" in payload) {
				return `user:${payload.email}`;
			}
			throw new InvalidDataFormatException(
				this.getKeySetOfRandomObject(data),
				"{ id } | { email }"
			);
		} else {
			return `cache:${parameter}:${JSON.stringify(data)}`;
		}
	}

	public static getAllCacheData(): { [key: string]: any } {
		return Cache.getAllKeys().reduce((obj, key) => {
			return {
				...obj,
				[key]: Cache.get(key),
			};
		}, {});
	}

	private static getKeySetOfRandomObject(object: any): string {
		if (SafetyUtils.isNonNull(object)) {
			const entries = Object.entries(object);
			const nonNullKeys = entries
				.filter(([_, value]) => SafetyUtils.isNonNull(value))
				.map(([key, _]) => key);
			if (nonNullKeys.length > 0) {
				return `{ ${nonNullKeys.join(", ")} }`;
			} else {
				throw new InvalidDataFormatException(
					object,
					"Object with at least one non-null property"
				);
			}
		} else {
			throw new InvalidDataFormatException(
				object,
				"Object with at least one non-null property"
			);
		}
	}

	public static setUser(keyGen: CachePayloadGenerator<"USER">, value: IUser) {
		const key = this.getKey(cacheParameter.USER, keyGen);
		Cache.set(key, value);
	}

	public static async fetchUser(
		keyGen: CachePayloadGenerator<"USER">,
		callback: () => Promise<IUser | null>
	) {
		return await CacheService.fetch(
			this.getKey(cacheParameter.USER, keyGen),
			callback
		);
	}

	public static invalidateUser(keyGen: CachePayloadGenerator<"USER">) {
		Cache.invalidate(this.getKey(cacheParameter.USER, keyGen));
	}

	public static clearAllCacheData() {
		Cache.flushAll();
	}

	public static get = Cache.get;
	public static invalidate = Cache.invalidate;
}
