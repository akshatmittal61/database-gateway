import { App, Schema } from "@/types";

export const AppSchema: Schema<App> = {
	name: {
		type: String,
		required: true,
	},
	identifier: {
		type: String,
		required: true,
		unique: true,
		index: {
			unique: true,
			sparse: true,
		},
	},
	description: {
		type: String,
	},
	origins: {
		type: [String],
		default: [],
	},
	allowedDbs: {
		type: [String],
		default: [],
	},
	apiKeyHash: {
		type: String,
		required: true,
		select: false, // Don't fetch by default, use .select('+apiKeyHash') explicitly
	},
	author: {
		type: String,
		ref: "User",
		required: true,
		index: true,
	},
};
