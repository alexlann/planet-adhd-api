import { Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import User from "./User.entity";
import { UserBody } from "./User.types";

export default class UserService {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    all = async () => {
        const users = await this.repository.find({
            order: {
                createdAt: "ASC"
            },
            relations: ["userLevel", "userLevel.level"],
        });
        return users;
    }

    findOne = async (id: number, userId?: number) => {
        const user = await this.repository.findOne({
            where: userId ? { id: userId } : { id },
            relations: ["userLevel", "userLevel.level"],
        });
        return user;
    }

    findOneBy = async (options: object) => {
        const user = await this.repository.findOne({
            where: options,
            relations: ["userLevel", "userLevel.level"],
        });
        return user;
    };

    findByEmailWithPassword = async (email: string) => {
        const user = await this.repository
            .createQueryBuilder("user")
            .where("user.email = :email", { email })
            .select("user.password")
            .getOne();
        return user;
    }

    create = async (body: UserBody) => {
        const user = await this.repository.save(this.repository.create(body));
        return user;
    }

    update = async (id: number, body: UserBody, userId: number) => {
        let user = await this.findOne(id, userId);
        if(user) {
            user = await this.repository.save({ ...user, ...body});
        }
        return user;
    }


    delete = async (id: number, userId?: number) => {
        let user = await this.repository.findOne({
            where: userId ? { id: userId } : { id },
            relations: ["goals", "tasks", "categories", "userLevel"]
        });
        if(user) {
            await this.repository.softDelete({ id });
        };
        return user;
    }
}