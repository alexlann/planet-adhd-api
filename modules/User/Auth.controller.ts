import { NextFunction, Request, Response } from "express";
import { createToken } from "../../middleware/auth";
import { AuthRequest } from "../../middleware/auth/auth.types";
import { UserRole } from "./User.constants";
import UserService from "./User.service";
import { UserBody } from "./User.types";
import UserLevelService from "../UserLevel/UserLevel.service";
import { UserLevelBody } from "../UserLevel/UserLevel.types";

export default class AuthController {
    private userService: UserService;
    private userLevelService: UserLevelService;

    constructor() {
        this.userService = new UserService();
        this.userLevelService = new UserLevelService();
    }
    
    login = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // don't show password
        const { user } = req;
        return res.json({
            user,
            token: createToken(user),
        });
    };

    register = async (
        // req: Request<UserBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const { body } = req;
        body.role = UserRole.User;
        // create user[]
        const userArray = await this.userService.create(req.body);
        // change to user for token
        const user = await this.userService.findOne(userArray["id"]);
        // add created userLevel to user
        user.userLevel = await this.userLevelService.create({ user: { id: user.id } } as UserLevelBody);

        res.json({
            user,
            token: createToken(user),
        });
    }

    registerAdmin = async (
        // req: Request<UserBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const { body } = req;
        body.role = UserRole.Admin;
        // create user[]
        const userArray = await this.userService.create(req.body);
        // change to user for token
        const user = await this.userService.findOne(userArray["id"]);
        res.json({
            user,
            token: createToken(user),
        });
    }
}
