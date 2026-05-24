import { config as populate } from "dotenv";

class ConfigService {
	constructor(private readonly env: { [k: string]: string | undefined }) {
		this.env = env;
		populate();
	}

	public get<T = string>(key: string): T {
		if (!this.env[key]) {
			throw new Error(`Key ${key} not found in environment`);
		}

		return this.env[key] as T;
	}

	public getNumber(key: string): number {
		const value = this.env[key];
		if (!value) {
			throw new Error(`Key ${key} not found in environment`);
		}

		if (isNaN(Number(value))) {
			throw new Error(`${key} is not a number`);
		}

		return Number(this.env[key]);
	}

	public getBoolean(key: string): boolean {
		const value = this.env[key];
		if (!value) {
			throw new Error(`Key ${key} not found in environment`);
		}

		if (
			(typeof value === "string" &&
				value !== "true" &&
				value !== "false") ||
			(typeof value === "number" && value !== 0 && value !== 1)
		) {
			throw new Error(
				`${value} of type ${typeof value} is not a valid boolean!`
			);
		}

		if (typeof value === "string") {
			return value === "true";
		} else if (typeof value === "number") {
			return value !== 0;
		} else {
			return value;
		}
	}

	public safeGet<T>(key: string, fallback: T): T {
		try {
			return this.get(key);
		} catch {
			return fallback;
		}
	}
}

export const config = new ConfigService(process.env);
