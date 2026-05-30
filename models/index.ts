import { AppSchema, UserSchema } from "@/schema";
import { App, User } from "@/types";
import { ModelFactory } from "./base";

export const UserModel = new ModelFactory<User>("User", UserSchema).model;
export const AppModel = new ModelFactory<App>("App", AppSchema).model;
