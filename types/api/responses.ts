import { AppInfo } from "@/types";

export type GetAllApps = AppInfo[];
export type GetApp = AppInfo;
export type CreateApp = AppInfo & { apiKey: string };
export type UpdateApp = AppInfo;
export type DeleteApp = AppInfo;
// Registration and rotation: plain key returned ONCE, never again
export type RotateKey = { identifier: string; apiKey: string };
