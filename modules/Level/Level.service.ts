import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import Level from "./Level.entity";
import { LevelBody } from "./Level.types";

export default class LevelService {
    private repository: Repository<Level>;

    constructor() {
        this.repository = AppDataSource.getRepository(Level);
    }

    all = async () => {
        const levels = await this.repository.find({
            relations: ["userLevels", "userLevels.user"],
            order: {
                levelNumber: "ASC",
            },
        });
        return levels;
    }

    findOne = async (id: number) => {
        const level = await this.repository.findOne({
            where: { id },
        });
        return level;
    }

    findOneByScore = async (score: number) => {
        const level = await this.repository.createQueryBuilder("level")
        .where("level.requiredTotalScore <= :score", {score})
        .andWhere("level.maxTotalScore >= :score", {score})
        .getOne();

        return level;
    }

    create = async (body: LevelBody) => {
        const level = await this.repository.save(this.repository.create(body));
        return level;
    }

    update = async (id: number, body: LevelBody) => {
        let level = await this.findOne(id);

        if(level) {
            level = await this.repository.save({ ...level, ...body});
        }

        return level;
    }

    delete = async (id: number) => {
        const level = await this.repository.findOne({
            where: { id },
            relations: ["userLevels"]
        });
        if (level) {
            await this.repository.softRemove(level);
        }
        return level;
    };
}