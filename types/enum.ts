export type T_USER_STATUS = "JOINED" | "INVITED";
export type T_USER_ROLE = "ADMIN" | "USER" | "GUEST";
export type T_BLOG_STATUS = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type T_NODE_ENV = "development" | "test" | "production";

export type LOG_LEVEL =
	| "log"
	| "info"
	| "warn"
	| "error"
	| "debug"
	| "verbose"
	| "silly"
	| "http";
