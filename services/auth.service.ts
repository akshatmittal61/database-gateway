import { jwtSecret } from "@/config";
import { Logger } from "@/log";
import { User } from "@/types";
import { StringUtils } from "@/utils";
import jwt from "jsonwebtoken";
import { UserService } from "./user.service";

export class AuthService {
	public static async getAuthenticatedUser(
		token: string
	): Promise<User | null> {
		try {
			const decoded: any = jwt.verify(token, jwtSecret);
			const userId = StringUtils.getNonEmptyString(decoded.id);
			return await UserService.getUserById(userId);
		} catch (error: any) {
			Logger.error(error.message);
			return null;
		}
	}

	public static generateToken(id: string): string {
		return jwt.sign({ id }, jwtSecret, {
			expiresIn: "30d",
		});
	}
}
