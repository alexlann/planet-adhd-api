import { Brackets, Repository } from "typeorm"
import { AppDataSource } from "../../database/DataSource";
import Task from "./Task.entity";
import { TaskBody } from "./Task.types";
import { getFirstLastDatesFromMonth } from "../maths";

export default class TaskService {
    private repository: Repository<Task>;

    constructor() {
        this.repository = AppDataSource.getRepository(Task);
    }

    all = async (id?: number, completed?: boolean, month?: string, day?: string) => {
        const tasks = await this.repository
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.goal', 'goal')
            .leftJoinAndSelect('tasks.category', 'category')
            .leftJoinAndSelect('tasks.user', 'user')
            .orderBy('tasks.startTime', 'ASC');

        if(id) {
            tasks.andWhere('tasks.user >= :user', {user: id});
        }
        if(completed && completed as unknown as string !== "null") {
            tasks.andWhere('tasks.completed = :completed', {completed: completed});
        }
        if(month) {
            const { monthFirst, monthLast } = getFirstLastDatesFromMonth(month);

            tasks.andWhere('tasks.startTime >= :startTime', {startTime: monthFirst});
            tasks.andWhere('tasks.stopTime <= :stopTime', {stopTime: monthLast});
        }
        if(day) {
            const startOfDay = new Date(day).toISOString();
            const endOfDay = new Date(new Date(day).setHours(23, 59, 59)).toISOString();

            // if startDate falls on day

            tasks.andWhere(new Brackets(qb => {
                qb.where(`tasks.startTime >= :begin AND tasks.startTime <= :end`, { begin: startOfDay, end: endOfDay})
                  .orWhere(`tasks.stopTime >= :begin AND tasks.stopTime <= :end`, { begin: startOfDay, end: endOfDay})
                  .orWhere(`tasks.startTime <= :begin AND tasks.stopTime >= :end`, { begin: startOfDay, end: endOfDay})
            }))
        }

        return tasks.getMany();
    }

    findOne = async (id: number, userId?: number) => {
        const task = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
            relations: ["goal", "category", "user"],
        });
        return task;
    }

    create = async (body: TaskBody) => {
        const task = await this.repository.save(this.repository.create(body));
        return task;
    }

    update = async (id: number, body: TaskBody, userId?: number) => {
        let task = await this.findOne(id, userId);

        if(task) {
            task = await this.repository.save({ ...task, ...body});
        }
        return task;
    }

    delete = async (id: number, userId?: number) => {
        const task = await this.repository.findOne({
            where: userId ? { id, user: { id: userId } } : { id },
            relations: ["goal"]
        });
        if (task) {
            await this.repository.softRemove(task);
        }
        return task;
    };
}