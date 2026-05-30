import { T_NODE_ENV, T_USER_ROLE, T_USER_STATUS } from "@/types";
import { getEnumeration } from "@/utils";

export const USER_STATUS = getEnumeration<T_USER_STATUS>(["INVITED", "JOINED"]);
export const USER_ROLE = getEnumeration<T_USER_ROLE>([
	"USER",
	"ADMIN",
	"GUEST",
]);
export const NODE_ENV = getEnumeration<T_NODE_ENV>([
	"development",
	"test",
	"production",
]);
