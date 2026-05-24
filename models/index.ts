import { BlogSchema, UserSchema } from "@/schema";
import { Blog, User } from "@/types";
import { ModelFactory } from "./base";

export const UserModel = new ModelFactory<User>("User", UserSchema).model;
export const BlogModel = new ModelFactory<Blog>("Blog", BlogSchema).model;
