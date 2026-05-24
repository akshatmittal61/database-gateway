import { IUser } from "@/types";
import { Request, Response } from "express";

export type ApiRequest<T = any> = Omit<Request, "body"> & {
	body: T;
	user?: IUser;
};
export type ApiResponse = Response;

export type ApiRes<T> = { message: string; data: T };

export type T_RESPONSE_MESSAGES =
	| "SUCCESS"
	| "FAILED"
	| "BAD_REQUEST"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "INTERNAL_SERVER_ERROR";

export type Headers = {
	[key: string]: any;
};
