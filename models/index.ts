import { UserSchema } from "@/schema";
import { User } from "@/types";
import { ModelFactory } from "./base";

export const UserModel = new ModelFactory<User>("User", UserSchema).model;
