import { Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import UserLevel from "./UserLevel.entity";
import { UserLevelBody } from "./UserLevel.types";
import LevelService from "../Level/Level.service";

export default class UserLevelService {
    private repository: Repository<UserLevel>;
    private levelService: LevelService;

    constructor() {
        this.repository = AppDataSource.getRepository(UserLevel);
        this.levelService = new LevelService();
    }

    all = async () => {
        const userLevels = await this.repository.find({
            relations: ["level", "user"],
            order: {
                level: {levelNumber: "ASC"},
            },
        });
        return userLevels;
    }

    findOneForUser = async (userId: number) => {
        const userLevel = await this.repository.findOne({
            where: { user: { id: userId} },
            relations: ["level", "user"],
            order: {
                level: {levelNumber: "ASC"},
            },
        });
        return userLevel;
    }

    findOne = async (id: number, userId: number) => {
        const userLevel = await this.repository.findOne({
            where: userId ? { id, user: { id: userId} } : { id },
            relations: ["level", "user"],
            order: {
                level: {levelNumber: "ASC"},
            },
        });
        return userLevel;
    }

    create = async (body: UserLevelBody) => {
        // find level based on score and add to body
        body.level = await this.levelService.findOneByScore(body.score || 0);

        const userLevel = await this.repository.save(this.repository.create(body));
        return userLevel;
    }

    update = async (id: number, body: UserLevelBody, userId?: number) => {
        let userLevel = await this.findOne(id, userId);

        if(userLevel) {
            userLevel = await this.repository.save({ ...userLevel, ...body});
        }

        return userLevel;
    }

    delete = async (id: number) => {
        const userLevel = await this.repository.findOne({
            where: { id },
        });
        if (userLevel) {
            await this.repository.softRemove(userLevel);
        }
        return userLevel;
    };
}