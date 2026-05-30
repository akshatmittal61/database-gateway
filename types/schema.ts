import { T_USER_ROLE, T_USER_STATUS } from "./enum";
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
 * App model
 * @param {string} name - Name of the app
 * @param {string} identifier - Identifier of the app (optional - defaults to name in kebab-case-random-id)
 * @param {string} description - Description of the app
 * @param {Array<string>} origins - Origins of the app
 * @param {Array<string>} allowedDbs - Databases allowed for the app (by name)
 * @param {string} apiKeyHash - Hash of the API key
 */
export type App = Model<{
	name: string;
	identifier: string;
	description?: string;
	origins: Array<string>;
	allowedDbs: Array<string>;
	apiKeyHash: string;
	author: string;
}>;
