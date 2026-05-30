export type CacheParameter = "USER";

type CachePayloadMap = {
	USER: { id: string } | { email: string };
};

export type CachePayloadGenerator<T extends CacheParameter> =
	CachePayloadMap[T];
