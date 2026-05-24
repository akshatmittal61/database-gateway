import { BlogModel } from "@/models";
import {
	Blog,
	CreateModel,
	FilterQuery,
	IBlog,
	UpdateQuery,
	User,
} from "@/types";
import { getObjectFromMongoResponse, SafetyUtils } from "@/utils";
import { BaseRepo } from "./base";

class BlogRepo extends BaseRepo<Blog, IBlog> {
	protected model = BlogModel;
	public parser(blog: Blog | null): IBlog | null {
		const parsed = super.parser(blog);
		if (!parsed) return null;
		return {
			...parsed,
			author: SafetyUtils.getNonNullValue(
				getObjectFromMongoResponse<User>(parsed.author)
			),
		};
	}
	public async findOne(query: Partial<Blog>): Promise<IBlog | null> {
		const res = await this.model.findOne<Blog>(query).populate("author");
		return this.parser(res);
	}

	public async findById(id: string): Promise<IBlog | null> {
		return await this.model
			.findById<Blog>(id)
			.populate("author")
			.then(this.parser)
			.catch((error: any) => {
				if (error.kind === "ObjectId") return null;
				throw error;
			});
	}

	public async find(query: FilterQuery<Blog>): Promise<IBlog[] | null> {
		const res = await this.model.find<Blog>(query).populate("author");
		const parsedRes = res.map(this.parser).filter((obj) => obj !== null);
		if (parsedRes.length > 0) return parsedRes;
		return null;
	}

	public async findAll(): Promise<Array<IBlog>> {
		const res = await this.model
			.find<Blog>()
			.sort({ createdAt: -1 })
			.populate("author");
		return res.map(this.parser).filter((obj) => obj !== null);
	}

	public async create(body: CreateModel<Blog>): Promise<IBlog> {
		const res = await this.model.create<CreateModel<Blog>>(body);
		await res.populate("author");
		return SafetyUtils.getNonNullValue(this.parser(res));
	}

	public async update(
		query: FilterQuery<Blog>,
		update: UpdateQuery<Blog>
	): Promise<IBlog | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndUpdate(filter, update, { new: true })
			.populate("author");
		return this.parser(res);
	}

	public async remove(query: Partial<Blog>): Promise<IBlog | null> {
		const filter = query.id ? { _id: query.id } : query;
		const res = await this.model
			.findOneAndDelete(filter)
			.populate("author");
		return this.parser(res);
	}
}

export const blogRepo = BlogRepo.getInstance<BlogRepo>();
