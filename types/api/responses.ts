import { IBlog } from "@/types";

// Blog
export type GetAllBlogs = Array<IBlog>;
export type GetBlogBySlug = IBlog;
export type CreateBlog = IBlog;
export type UpdateBlog = IBlog | null;
export type DeleteBlog = IBlog;
