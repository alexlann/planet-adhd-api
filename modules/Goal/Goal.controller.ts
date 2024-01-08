import { Response, NextFunction } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import GoalService from "./Goal.service";
import { GoalBody } from "./Goal.types";

export default class GoalController {
    private goalService: GoalService;

    constructor() {
        this.goalService = new GoalService();
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
        const limit = req.query.limit;

        const goals = await this.goalService.all(!req.user.isAdmin() && req.user.id, completed, limit);
        
        return res.json(goals);
    }

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const goal = await this.goalService.findOne(
            parseInt(req.params.id),
            !req.user.isAdmin() && req.user.id,
        );

        if (!goal) {
            next(new NotFoundError());
            return;
        }

        return res.json(goal);
    };

    create = async (
        // req: AuthRequest<{}, {}, GoalBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if role user, change userId to id of user
        if(!req.user.isAdmin()) {
            req.body.user = req.user;
        }
        
        const goal = await this.goalService.create(req.body);
        return res.json(goal);
    }

    update = async (
        // req: AuthRequest<{ id: string }, {}, GoalBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const goal = await this.goalService.update(
                parseInt(req.params.id),
                req.body,
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!goal) {
                next(new NotFoundError());
                return;
            }

            return res.json(goal); 

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
            const goal = await this.goalService.delete(
                parseInt(req.params.id),
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!goal) {
                next(new NotFoundError());
                return;
            }

            return res.json({});

        } catch (error) {
            next(error);
        }
    };
};