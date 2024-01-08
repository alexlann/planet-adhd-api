import { Response, NextFunction } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import LevelService from "./Level.service";
import { LevelBody } from "./Level.types";
import ForbiddenError from "../../errors/ForbiddenError";

export default class LevelController {
    private levelService: LevelService;

    constructor() {
        this.levelService = new LevelService();
    }

    all = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if admin, show all levels
        if(req.user.isAdmin()) {
            const levels = await this.levelService.all();
            return res.json(levels);
        }
        next(new ForbiddenError);
        return;
    }

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const level = await this.levelService.findOne(
            parseInt(req.params.id),
        );

        // if level not found, trow error
        if (!level) {
            next(new NotFoundError());
            return;
        }

        return res.json(level);
    };

    create = async (
        // req: AuthRequest<{}, {}, LevelBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if admin, create level
        if(req.user.isAdmin()) {
            const level = await this.levelService.create(req.body);
            return res.json(level);
        }
        next(new ForbiddenError);
        return;
    }

    update = async (
        // req: AuthRequest<{ id: string }, {}, LevelBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if admin, try to change level
        if(req.user.isAdmin()) {
            try {
                const level = await this.levelService.update(
                    parseInt(req.params.id),
                    req.body,
                );

                if (!level) {
                    next(new NotFoundError());
                    return;
                }

                return res.json(level); 

            } catch (error) {
                next(error);
            }
        }
        next(new ForbiddenError);
        return;
    };

    delete = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if admin, try to delete level
        if(req.user.isAdmin()) {
            try {
                const level = await this.levelService.delete(
                    parseInt(req.params.id),
                );
        
                if (!level) {
                    next(new NotFoundError());
                    return;
                }

                return res.json({});

            } catch (error) {
                next(error);
            }
        }
        next(new ForbiddenError);
        return;
    };
};