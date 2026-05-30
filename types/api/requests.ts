import { App, CreateModel, UpdateModel } from "@/types";

// Blog
export type CreateApp = CreateModel<App>;
export type UpdateApp = UpdateModel<Omit<App, "apiKeyPrefix" | "author">>;
