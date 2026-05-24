import { Blog, User } from "./schema";

// Types prefixed with `I` are client-specific models

export type IUser = User;

export type IBlog = Omit<Blog, "author"> & {
	author: User;
};
