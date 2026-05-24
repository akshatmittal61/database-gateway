import { ApiFailure, ApiSuccess } from "@/base";
import { BLOG_STATUS, HTTP } from "@/constants";
import { BlogService } from "@/services";
import {
	ApiRequest,
	ApiResponse,
	ApiResponses,
	Blog,
	T_BLOG_STATUS,
} from "@/types";
import { StringUtils } from "@/utils";

export class BlogsController {
	public static async getAllBlogs(_: ApiRequest, res: ApiResponse) {
		const publishedBlogs = await BlogService.getAllPublishedBlogs();
		return new ApiSuccess<ApiResponses.GetAllBlogs>(res)
			.data(publishedBlogs)
			.send();
	}

	public static async getBlogBySlug(req: ApiRequest, res: ApiResponse) {
		const slug = StringUtils.getNonEmptyString(req.params.slug);
		const blog = await BlogService.getBlogBySlug(slug);
		if (!blog) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("Blog not found")
				.send();
		}
		return new ApiSuccess<ApiResponses.GetBlogBySlug>(res)
			.data(blog)
			.send();
	}

	public static async createBlog(req: ApiRequest, res: ApiResponse) {
		const title = StringUtils.getNonEmptyString(req.body.title);
		const slug = StringUtils.getNonEmptyString(req.body.slug);
		const content = StringUtils.getNonEmptyString(req.body.content);
		const author = StringUtils.getNonEmptyString(req.user?.id);
		const status = StringUtils.getNonEmptyStringOrElse<T_BLOG_STATUS>(
			req.body.status,
			BLOG_STATUS.DRAFT
		);
		const blog = await BlogService.createBlog({
			title,
			slug,
			content,
			author,
			status,
		});
		return new ApiSuccess<ApiResponses.CreateBlog>(res)
			.status(HTTP.status.CREATED)
			.data(blog)
			.send();
	}

	public static async updateBlog(req: ApiRequest, res: ApiResponse) {
		const blogId = StringUtils.getNonEmptyString(req.params.id);
		const currentUserId = StringUtils.getNonEmptyString(req.user?.id);
		const title = StringUtils.getNonEmptyString(req.body.title);
		const content = StringUtils.getNonEmptyString(req.body.content);
		const status = StringUtils.getNonEmptyString<T_BLOG_STATUS>(
			req.body.status
		);
		const body: Partial<Omit<Blog, "id" | "author">> = {};
		if (title) body["title"] = title;
		if (content) body["content"] = content;
		if (status) body["status"] = status;
		const blog = await BlogService.updateBlog({
			blogId,
			currentUserId,
			body,
		});
		return new ApiSuccess<ApiResponses.UpdateBlog>(res).data(blog).send();
	}

	public static async removeBlog(req: ApiRequest, res: ApiResponse) {
		const blogId = StringUtils.getNonEmptyString(req.params.id);
		const currentUserId = StringUtils.getNonEmptyString(req.user?.id);
		const blog = await BlogService.removeBlog({ blogId, currentUserId });
		if (!blog) {
			return new ApiFailure(res)
				.status(HTTP.status.NOT_FOUND)
				.message("Blog not found")
				.send();
		}
		return new ApiSuccess<ApiResponses.DeleteBlog>(res)
			.status(HTTP.status.REMOVED)
			.data(blog)
			.send();
	}
}
