import { HTTP } from "@/constants";
import {
	ApiError,
	DbConnectionError,
	InvalidDataFormatException,
	ParserSafetyError,
} from "@/errors";
import { Logger } from "@/log";
import { ApiRequest, ApiResponse } from "@/types";
import { NextFunction } from "express";
import { MongooseError } from "mongoose";

export class ErrorHandler {
	public static process = (
		error: any,
		_: ApiRequest,
		res: ApiResponse,
		next: NextFunction
	) => {
		Logger.debug("Error caught at final handler", error, error.message);
		if (res.headersSent) {
			return next(error);
		}
		if (error instanceof ApiError) {
			return res.status(error.status).json({ message: error.message });
		} else if (
			error instanceof DbConnectionError ||
			error instanceof MongooseError
		) {
			return res.status(HTTP.status.SERVICE_UNAVAILABLE).json({
				message: error.message || HTTP.message.DB_CONNECTION_ERROR,
			});
		} else if (
			error instanceof ParserSafetyError ||
			error instanceof InvalidDataFormatException
		) {
			return res
				.status(HTTP.status.BAD_REQUEST)
				.json({ message: error.message || HTTP.message.BAD_REQUEST });
		} else {
			return res.status(HTTP.status.INTERNAL_SERVER_ERROR).json({
				message: error.message || HTTP.message.INTERNAL_SERVER_ERROR,
			});
		}
	};
}
