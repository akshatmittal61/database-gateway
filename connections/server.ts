import { ServerController } from "@/controllers";
import { createDbContainer } from "@/db";
import { Logger } from "@/log";
import { ErrorHandler, ServerMiddleware } from "@/middlewares";
import { apiRouter } from "@/routes";
import express from "express";
import { Server as HttpServer } from "http";

export class Server {
	private app = express();
	private instance: HttpServer;
	private readonly port: number;
	private container;

	public constructor(port: number, dbUri: string) {
		this.container = createDbContainer(dbUri);
		this.port = port;
		this.instance = new HttpServer(this.app);
	}

	private bindMiddlewares() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(ServerMiddleware.tracer);
		this.app.use(ServerMiddleware.cors);
		this.app.use(ServerMiddleware.parseCookies);
		this.app.use(ServerMiddleware.profiler);
	}

	private createRouter() {
		this.app.get("/api/health", ServerController.health(this.container.db));
		this.app.get(
			"/api/heartbeat",
			ServerController.heartbeat(this.container.db)
		);
		this.app.use(ServerMiddleware.useDb(this.container.db));
		this.app.use("/api/v1", apiRouter);
		this.app.use(ErrorHandler.process);
	}

	public async connectDb() {
		const connectionStatus = await this.container.db.connect();
		if (connectionStatus) {
			Logger.info("MongoDB connected");
		} else {
			Logger.error("Database connection failed");
			Logger.info("Server is running without database");
		}
	}

	public async disconnectDb() {
		await this.container.db.disconnect();
		Logger.info("MongoDB disconnected");
	}

	public async start() {
		this.bindMiddlewares();
		this.createRouter();
		await this.connectDb();
		this.instance = this.app.listen(this.port, () => {
			Logger.info(`Server listening on port ${this.port}`);
		});
	}

	public async stop() {
		await this.disconnectDb();
		await new Promise((resolve) => this.instance.close(resolve));
	}
}
