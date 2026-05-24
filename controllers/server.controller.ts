import { ApiFailure, ApiSuccess } from "@/base";
import { DatabaseManager } from "@/connections";
import { HTTP } from "@/constants";
import { ApiRequest, ApiResponse, IUser } from "@/types";

type HealthPayload = {
	identity: number;
	uptime: number;
	timestamp: string;
	database: boolean;
};

type HeartbeatPayload = HealthPayload & {
	user: IUser | null;
};

export class ServerController {
	public static health =
		(db: DatabaseManager) => (_: ApiRequest, res: ApiResponse) => {
			if (!db.isConnected()) {
				return new ApiFailure(res)
					.status(HTTP.status.SERVICE_UNAVAILABLE)
					.message(HTTP.message.DB_CONNECTION_ERROR)
					.send();
			}
			const payload: HealthPayload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
			};
			return new ApiSuccess<HealthPayload>(res)
				.message(HTTP.message.HEALTHY_API)
				.data(payload)
				.send();
		};
	public static heartbeat =
		(db: DatabaseManager) => (_: ApiRequest, res: ApiResponse) => {
			const payload: HeartbeatPayload = {
				identity: process.pid,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				database: db.isConnected(),
				// use auth checker service to populate logged-in user details in heartbeat
				user: null,
			};
			return new ApiSuccess<HeartbeatPayload>(res)
				.message(HTTP.message.HEARTBEAT)
				.data(payload)
				.send();
		};
}
