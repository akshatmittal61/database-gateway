import { HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { userRepo } from "@/repo";
import { CreateModel, User } from "@/types";
import { CacheService } from "./cache.service";

export class UserService {
	public static async getUserById(id: string): Promise<User | null> {
		return await CacheService.fetchUser({ id }, () =>
			userRepo.findById(id)
		);
	}

	public static async findOrCreateUserByEmail(
		email: string,
		body: CreateModel<User>
	): Promise<{ user: User; isNew: boolean }> {
		const foundUser = await userRepo.findOne({ email });
		if (foundUser) {
			return { user: foundUser, isNew: false };
		}
		const createdUser = await userRepo.create(body);
		return { user: createdUser, isNew: true };
	}

	public static async searchByEmail(
		emailQuery: string
	): Promise<Array<User>> {
		if (!emailQuery) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query is required"
			);
		}
		if (emailQuery.length < 3) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Email query too short"
			);
		}
		const query = emailQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const res = await userRepo.find({
			email: { $regex: query, $options: "i" },
		});
		if (!res) return [];
		return res;
	}
}
