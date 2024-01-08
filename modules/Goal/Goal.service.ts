import { Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import Goal from "./Goal.entity";
import { GoalBody } from "./Goal.types";

export default class GoalService {
    private repository: Repository<Goal>;

    constructor() {
        this.repository = AppDataSource.getRepository(Goal);
    }

    all = async (id?: number, completed?: boolean, limit?: number) => {
        const goals = await this.repository
            .createQueryBuilder('goals')
            .leftJoinAndSelect('goals.user', 'user')
            .leftJoinAndSelect('goals.tasks', 'tasks');

        if(id) {
            goals.andWhere('goals.user = :user', {user: id});
        }
        if(completed && completed as unknown as string !== "null") {
            goals.andWhere('goals.completed = :completed', {completed: completed});
        }
        if(limit && limit as unknown as string !== "null") {
            goals.take(limit);
        }

        return goals.getMany();
    }

    findOne = async (id: number, userId?: number) => {
        const goal = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
            relations: ["user", "tasks"],
        });
        return goal;
    }

    create = async (body: GoalBody) => {
        const goal = await this.repository.save(this.repository.create(body));
        return goal;
    }

    update = async (id: number, body: GoalBody, userId?: number) => {
        let goal = await this.findOne(id, userId);

        if(goal) {
            goal = await this.repository.save({ ...goal, ...body});
        }
        return goal;
    }

    delete = async (id: number, userId?: number) => {
        const goal = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
            relations: ["tasks"],
        });
        if (goal) {
            await this.repository.softRemove(goal);
        }
        return goal;
    };
}