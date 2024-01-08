import { NextFunction, Response } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import UserService from "./User.service";
import { UserBody } from "./User.types";
import { UserRole } from "./User.constants";
import ForbiddenError from "../../errors/ForbiddenError";

export default class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    all = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const users = await this.userService.all();
        return res.json(users);
    };

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const user = await this.userService.findOne(
            parseInt(req.params.id),
            !req.user.isAdmin() && req.user.id,
        );
        if (!user) {
            next(new NotFoundError());
        }
        return res.json(user);
    };

    create = async (
        // req: AuthRequest<{}, {}, UserBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        req.body.role = !req.body.role && UserRole.User;
        const user = await this.userService.create(req.body);
        return res.json(user);
    };

    update = async (
        // req: AuthRequest<{ id: string }, {}, UserBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user.isAdmin() && parseInt(req.params.id) !== req.user.id) {
                next(new ForbiddenError());
            }

            const user = await this.userService.update(
                parseInt(req.params.id),
                req.body,
                !req.user.isAdmin() && req.user.id,
            );

            if (!user) {
                next(new NotFoundError());
            }
            return res.json(user);
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
            if (!req.user.isAdmin() && parseInt(req.params.id) !== req.user.id) {
                next(new ForbiddenError());
            }
            
            const user = await this.userService.delete(
                parseInt(req.params.id),
                !req.user.isAdmin() && req.user.id,
            );
            
            if (!user) {
                next(new NotFoundError());
            }
            return res.json({});
        } catch (error) {
            next(error);
        }
    };
}