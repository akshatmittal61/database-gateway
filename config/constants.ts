import { T_NODE_ENV } from "@/types";
import { config } from "./base";

export const service = config.safeGet<string>("SERVICE", "template");

export const PORT = config.safeGet<number>("PORT", 8000);

export const dbUri = config.get("DB_URI");

export const jwtSecret = config.safeGet<string>("JWT_SECRET", "secret");

export const nodeEnv = config.safeGet<T_NODE_ENV>("NODE_ENV", "development");
