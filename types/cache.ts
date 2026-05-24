export type CacheParameter = "USER" | "BLOG";

type CachePayloadMap = {
	USER: { id: string } | { email: string };
	BLOG: { id: string };
};

export type CachePayloadGenerator<T extends CacheParameter> =
	CachePayloadMap[T];
