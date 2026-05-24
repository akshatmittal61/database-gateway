import { config } from "./base";

export const enableDebugging = config.safeGet<boolean>(
	"ENABLE_DEBUGGING",
	false
);
