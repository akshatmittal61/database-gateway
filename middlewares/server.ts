import { DatabaseManager } from "@/connections";
import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { ApiRequest, ApiResponse } from "@/types";
import { default as corsMiddleware } from "cors";
import { NextFunction } from "express";

export class ServerMiddleware {
	public static parseCookies = (
		req: ApiRequest,
		_: ApiResponse,
		next: NextFunction
	) => {
		const cookie: typeof req.cookies = {};
		const list = req.headers.cookie?.split(";") || [];
		for (const item of list) {
			const parts = item.split("=");
			const key = parts.shift()?.trim() || "";
			if (!key) continue;
			cookie[key] = decodeURIComponent(parts.join("="));
		}
		req.cookies = cookie;
		return next();
	};

	public static cors = corsMiddleware({
		origin: "*",
	});

	public static useDb =
		(db: DatabaseManager) =>
		(_: ApiRequest, res: ApiResponse, next: NextFunction) => {
			if (!db.isConnected()) {
				Logger.error("Unable to connect to database");
				return db.connect().then((isConnected) => {
					if (isConnected) {
						return next();
					} else {
						return res
							.status(HTTP.status.SERVICE_UNAVAILABLE)
							.json({
								message: HTTP.message.DB_CONNECTION_ERROR,
							});
					}
				});
			}
			return next();
		};

	public static tracer = (
		req: ApiRequest,
		_: ApiResponse,
		next: NextFunction
	) => {
		let curl = "\ncurl";
		curl += ` -X ${req.method} ${req.originalUrl}\n`;
		for (const [key, value] of Object.entries(req.headers)) {
			curl += ` -H "${key}: ${value}"\n`;
		}
		if (req.body) {
			curl += ` -d '${JSON.stringify(req.body)}'\n`;
		}
		Logger.debug(curl);
		return next();
	};

	public static profiler = (
		req: ApiRequest,
		res: ApiResponse,
		next: NextFunction
	) => {
		const start = process.hrtime(); // Use high-resolution timer

		res.on("finish", () => {
			const end = process.hrtime(start);
			const elapsed = (end[0] * 1e9 + end[1]) / 1e6; // Convert to milliseconds
			Logger.debug(
				`Request: ${req.method} ${req.originalUrl} ${res.statusCode} took ${elapsed}ms`
			);
		});

		return next();
	};
}
