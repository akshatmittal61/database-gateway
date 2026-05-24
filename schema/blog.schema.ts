import { BLOG_STATUS } from "@/constants";
import { Blog, ObjectId, Schema } from "@/types";

export const BlogSchema: Schema<Blog> = {
	title: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	content: {
		type: String,
		required: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	status: {
		type: String,
		enum: Object.values(BLOG_STATUS),
		default: BLOG_STATUS.DRAFT,
	},
	author: {
		type: ObjectId,
		ref: "User",
		required: true,
	},
};
