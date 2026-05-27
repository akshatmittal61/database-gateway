import { CreateModel, UpdateModel } from "./parser";
import { App, User } from "./schema";

// Types prefixed with `I` are client-specific models

export type IUser = User;

export type IApp = App;
export type AppInfo = Omit<IApp, "apiKeyHash">;
export type ICreateApp = CreateModel<AppInfo & { apiKey: string }>;
export type IUpdateApp = UpdateModel<App>;
