export type DbOperation =
	| "findOne"
	| "findById"
	| "find"
	| "findAll"
	| "create"
	| "update"
	| "remove"
	| "countDocuments"
	| "aggregate";

export interface QueryPayload {
	filter?: Record<string, unknown>;
	update?: Record<string, unknown>;
	pipeline?: Record<string, unknown>[];
	options?: Record<string, unknown>;
	id?: string;
	body?: Record<string, unknown>;
}

export interface GatewayQueryRequest {
	db: string;
	collection: string;
	operation: DbOperation;
	payload: QueryPayload;
}

export type GatewayQueryResponse<T = unknown> =
	| { data: T | null; message: string }
	| { error: string };
