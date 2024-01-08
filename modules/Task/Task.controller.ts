import { Response, NextFunction } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import TaskService from "./Task.service";
import { TaskBody } from "./Task.types";
import CategoryService from "../Category/Category.service";
import GoalService from "../Goal/Goal.service";

export default class TaskController {
    private taskService: TaskService;
    private goalService: GoalService;
    private categoryService: CategoryService;

    constructor() {
        this.taskService = new TaskService();
        this.goalService = new GoalService();
        this.categoryService = new CategoryService();
    }

    all = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // TODO: typing
        //@ts-ignore
        const completed = req.query.completed;

        // TODO: typing
        //@ts-ignore
        const month = req.query.month;

        // TODO: typing
        //@ts-ignore
        const day = req.query.day;

        const tasks = await this.taskService.all(!req.user.isAdmin() && req.user.id, completed, month, day);
        return res.json(tasks);
    }

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const task = await this.taskService.findOne(
            parseInt(req.params.id),
            !req.user.isAdmin() && req.user.id,
        );

        if (!task) {
            next(new NotFoundError());
            return;
        }

        return res.json(task);
    };

    create = async (
        // req: AuthRequest<{}, {}, TaskBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if role user, check if task exists for user
        if(!req.user.isAdmin()) {
            req.body.user = req.user;

            const category = await this.categoryService.findOne(
                // @ts-ignore
                req.body.category,
                req.user.id,
            );

            const goal = await this.goalService.findOne(
                // @ts-ignore
                req.body.goal,
                req.user.id,
            );

            if (!category || !goal) {
                next(new NotFoundError());
                return;
            }
        }

        const task = await this.taskService.create(req.body);
        return res.json(task);
    }

    update = async (
        // req: AuthRequest<{ id: string }, {}, TaskBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.taskService.update(
                parseInt(req.params.id),
                req.body,
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!task) {
                next(new NotFoundError());
                return;
            }

            return res.json(task); 

        } catch (error) {
            next(error);
        }
    };

    delete = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.taskService.delete(
                parseInt(req.params.id),
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!task) {
                next(new NotFoundError());
                return;
            }

            return res.json({});

        } catch (error) {
            next(error);
        }
    };
};