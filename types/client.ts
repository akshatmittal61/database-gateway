import { CreateModel, UpdateModel } from "./parser";
import { App, User } from "./schema";

// Types prefixed with `I` are client-specific models

export type IUser = User;

export type IApp = Omit<App, "author"> & { author: IUser };
export type AppInfo = Omit<IApp, "apiKeyHash" | "apiKeyPrefix">;
export type ICreateApp = CreateModel<Omit<AppInfo, "author" | "lastUsedAt">>;
export type IUpdateApp = UpdateModel<Omit<AppInfo, "author">>;
