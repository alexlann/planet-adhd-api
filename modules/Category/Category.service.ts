import { Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import Category from "./Category.entity";
import { CategoryBody } from "./Category.types";

export default class CategoryService {
    private repository: Repository<Category>;

    constructor() {
        this.repository = AppDataSource.getRepository(Category);
    }

    all = async (id?: number) => {
        const categories = await this.repository.find({
            where: id && { user: { id } },
            relations: ["user"],
            order: {
                title: "ASC",
            },
        });
        return categories;
    }

    findOne = async (id: number, userId?: number) => {
        const category = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
            relations: ["user"],
        });
        return category;
    }

    create = async (body: CategoryBody) => {
        const category = await this.repository.save(this.repository.create(body));
        return category;
    }

    update = async (id: number, body: CategoryBody, userId?: number) => {
        let category = await this.findOne(id, userId);

        if(category) {
            category = await this.repository.save({ ...category, ...body});
        }
        return category;
    }

    delete = async (id: number, userId?: number) => {
        const category = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
        });
        if (category) {
            await this.repository.softRemove(category);
        }
        return category;
    };
}