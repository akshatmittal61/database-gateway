import { T_BLOG_STATUS, T_USER_ROLE, T_USER_STATUS } from "./enum";
import { Model } from "./parser";

/**
 * User model
 * @param {string} name - Name of the user (optional - defaults to email prefix)
 * @param {string} username - Username of the user (optional - defaults to email prefix)
 * @param {string} email - Email of the user
 * @param {string} role - Role of the user - USER | ADMIN | GUEST
 * @param {string} status - Status of the user - JOINED | INVITED
 */
export type User = Model<{
	name: string;
	username: string;
	email: string;
	role: T_USER_ROLE;
	status: T_USER_STATUS;
}>;

/**
 * Blog model
 * @param {string} title - Title of the blog
 * @param {string} slug - Slug of the blog
 * @param {string} content - Content of the blog
 * @param {number} likes - Number of likes on the blog (optional - defaults to 0)
 * @param {string} status - Status of the blog - ACTIVE | INACTIVE
 * @param {string} author - Author of the blog
 */
export type Blog = Model<{
	title: string;
	slug: string;
	content: string;
	likes?: number;
	status: T_BLOG_STATUS;
	author: string;
}>;
