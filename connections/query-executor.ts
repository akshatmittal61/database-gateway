import mongoose from "mongoose";
import { Logger } from "@/log";
import {
	DbOperation,
	GatewayQueryRequest,
	GatewayQueryResponse,
	QueryPayload,
} from "@/types";

export class QueryExecutor {
	public static async execute<T extends mongoose.Document>(
		request: GatewayQueryRequest
	): Promise<GatewayQueryResponse<T>> {
		const { db, collection, operation, payload } = request;
		try {
			const col = mongoose.connection.useDb(db).collection(collection);
			const data = await QueryExecutor.runOperation<T>(
				col,
				operation,
				payload
			);
			return {
				data,
				message: `${operation} on ${db}.${collection} executed successfully`,
			};
		} catch (error: any) {
			Logger.error(
				`[QueryExecutor] ${operation} on ${db}.${collection} failed:`,
				error.message
			);
			return { data: null, error: error.message };
		}
	}

	private static async runOperation<T extends mongoose.Document>(
		col: mongoose.mongo.Collection,
		operation: DbOperation,
		payload: QueryPayload
	): Promise<T | null> {
		const {
			filter = {},
			update = {},
			pipeline = [],
			options = {},
			id,
			body = {},
		} = payload;

		const resolveFilter = () =>
			id ? { _id: new mongoose.Types.ObjectId(id) } : filter;

		switch (operation) {
			case "findOne":
				return col.findOne<T>(
					resolveFilter(),
					options
				) as Promise<T | null>;

			case "findById": {
				if (!id) throw new Error("findById requires payload.id");
				return col.findOne<T>(
					{ _id: new mongoose.Types.ObjectId(id) },
					options
				) as Promise<T | null>;
			}

			case "find":
				return col
					.find<T>(resolveFilter(), options)
					.toArray() as unknown as Promise<T | null>;

			case "findAll":
				return col
					.find<T>({}, options)
					.sort({ createdAt: -1 })
					.toArray() as unknown as Promise<T | null>;

			case "create": {
				const now = new Date();
				const result = await col.insertOne(
					{ ...body, createdAt: now, updatedAt: now },
					options
				);
				return col.findOne<T>({
					_id: result.insertedId,
				}) as Promise<T | null>;
			}

			case "update": {
				const result = await col.findOneAndUpdate(
					resolveFilter(),
					{ $set: { ...update, updatedAt: new Date() } },
					{ returnDocument: "after", ...options }
				);
				return result as T | null;
			}

			case "remove": {
				const result = await col.findOneAndDelete(
					resolveFilter(),
					options
				);
				return result as T | null;
			}

			case "countDocuments":
				return col.countDocuments(
					resolveFilter(),
					options
				) as unknown as Promise<T | null>;

			case "aggregate":
				return col
					.aggregate<T>(pipeline, options)
					.toArray() as unknown as Promise<T | null>;

			default:
				throw new Error(`Unsupported operation: ${operation}`);
		}
	}
}
