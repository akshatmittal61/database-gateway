import { HTTP } from "@/constants";
import { Logger } from "@/log";
import { AuthService } from "@/services";
import { ApiRequest, ApiResponse } from "@/types";
import { NextFunction } from "express";

export class AuthMiddleware {
	public static isLoggedIn = async (
		req: ApiRequest,
		res: ApiResponse,
		next: NextFunction
	) => {
		try {
			const token = req.headers.authorization?.split("Bearer ")[0];
			if (!token) {
				return res
					.status(HTTP.status.UNAUTHORIZED)
					.json({ message: HTTP.message.UNAUTHORIZED });
			}
			const loggedInUser = await AuthService.getAuthenticatedUser(token);
			if (!loggedInUser) {
				return res
					.status(HTTP.status.UNAUTHORIZED)
					.json({ message: "Please login to continue" });
			}
			Logger.debug("loggedInUser", loggedInUser);
			req.user = loggedInUser;
			return next();
		} catch (error: any) {
			Logger.error(error);
			return res
				.status(HTTP.status.UNAUTHORIZED)
				.json({ message: HTTP.message.UNAUTHORIZED });
		}
	};
}
