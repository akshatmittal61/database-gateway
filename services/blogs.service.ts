import { BLOG_STATUS, HTTP } from "@/constants";
import { ApiError } from "@/errors";
import { blogRepo } from "@/repo";
import { CacheService } from "@/services";
import { Blog, CreateModel, IBlog } from "@/types";
import { UserService } from "./user.service";

export class BlogService {
	public static async getAllPublishedBlogs(): Promise<Array<IBlog>> {
		return (await blogRepo.find({ status: BLOG_STATUS.PUBLISHED })) || [];
	}
	public static async getBlogById(id: string): Promise<IBlog | null> {
		return await blogRepo.findById(id);
	}
	public static async getBlogBySlug(slug: string): Promise<IBlog | null> {
		return await blogRepo.findOne({ slug });
	}
	public static async createBlog(body: CreateModel<Blog>): Promise<IBlog> {
		const author = await UserService.getUserById(body.author);
		if (!author) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Author does not exist"
			);
		}
		const isSlugInUse = await blogRepo.findOne({ slug: body.slug });
		if (isSlugInUse) {
			throw new ApiError(HTTP.status.CONFLICT, "Slug already in use");
		}
		return await blogRepo.create(body);
	}
	public static async updateBlog({
		blogId,
		currentUserId,
		body,
	}: {
		blogId: string;
		currentUserId: string;
		body: Partial<Omit<Blog, "id" | "author">>;
	}) {
		const currentUser = await UserService.getUserById(currentUserId);
		if (!currentUser) {
			throw new ApiError(
				HTTP.status.BAD_REQUEST,
				"Author does not exist"
			);
		}
		const foundBlog = await blogRepo.findById(blogId);
		if (!foundBlog) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Blog not found");
		}
		if (foundBlog.author.id !== currentUserId) {
			throw new ApiError(
				HTTP.status.UNAUTHORIZED,
				"You are not the author of this blog"
			);
		}
		CacheService.invalidateBlog({ id: blogId });
		return await blogRepo.update({ id: blogId }, body);
	}
	public static async removeBlog({
		blogId,
		currentUserId,
	}: {
		blogId: string;
		currentUserId: string;
	}) {
		const foundBlog = await blogRepo.findById(blogId);
		if (!foundBlog) {
			throw new ApiError(HTTP.status.NOT_FOUND, "Blog not found");
		}
		if (foundBlog.author.id !== currentUserId) {
			throw new ApiError(
				HTTP.status.UNAUTHORIZED,
				"You are not the author of this blog"
			);
		}
		CacheService.invalidateBlog({ id: blogId });
		return await blogRepo.remove({ id: blogId });
	}
}
