import { Response, NextFunction } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import ForbiddenError from "../../errors/ForbiddenError";
import UserLevelService from "./UserLevel.service";
import { UserLevelBody } from "./UserLevel.types";
import LevelService from "../Level/Level.service";

export default class UserLevelController {
    private userLevelService: UserLevelService;
    private levelService: LevelService;

    constructor() {
        this.userLevelService = new UserLevelService();
        this.levelService = new LevelService();
    }

    all = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if admin, show all userLevels, else show just one
        if(req.user.isAdmin()) {
            const userLevels = await this.userLevelService.all();
            return res.json(userLevels);
        } else {
            const userLevel = await this.userLevelService.findOneForUser(req.user.id);
            return res.json(userLevel);
        }
    }

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // pass userId if user not admin
        const userLevel = await this.userLevelService.findOne(
            parseInt(req.params.id),
            !req.user.isAdmin() && req.user.id,
        );

        if (!userLevel) {
            next(new NotFoundError());
            return;
        }

        return res.json(userLevel);
    };

    findForUser = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // pass userId if user not admin
        const userLevel = await this.userLevelService.findOneForUser(
            !req.user.isAdmin() ? req.user.id : parseInt(req.params.id),
        );

        if (!userLevel) {
            next(new NotFoundError());
            return;
        }

        return res.json(userLevel);
    };

    create = async (
        // req: AuthRequest<{}, {}, UserLevelBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if userlevel of user already exists, throw error
        // user can only have one userLevel
        if (!req.user.isAdmin() && await this.userLevelService.findOneForUser(req.user.id)) {
            next(new ForbiddenError());
            return;
        }

        // change to correct userId if user not admin
        if(!req.user.isAdmin()) {
            req.body.user = req.user;
        }

        // set correct level
        req.body.level = await this.levelService.findOneByScore( req.body.score );

        const userLevel = await this.userLevelService.create(req.body);
        return res.json(userLevel);
    }

    update = async (
        // req: AuthRequest<{ id: string }, {}, UserLevelBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const currentUserLevel = req.user.isAdmin()
            ? await this.userLevelService.findOneForUser(req.user.id)
            : await this.userLevelService.findOneForUser(req.user.id);

            // if user is not admin, find correct userLevelId
            if (!req.user.isAdmin()) {
                req.params.id = `${currentUserLevel.id}`;
            }

            // if score surpassed max score for level, look for new level and add to body
            if(currentUserLevel.level.maxTotalScore < req.body.score) {
                const level = await this.levelService.findOneByScore( req.body.score || currentUserLevel.score );
                req.body.level = level;
                req.body.levelId = level.id;
            }

            const userLevel = await this.userLevelService.update(
                parseInt(req.params.id),
                req.body,
                !req.user.isAdmin() && req.user.id,
            );

            // if userLevel not found, throw error
            if (!userLevel) {
                next(new NotFoundError());
                return;
            }

            return res.json(userLevel); 

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
        // if user is admin
        if (req.user.isAdmin()) {
            try {
                const userLevel = await this.userLevelService.delete(
                    parseInt(req.params.id),
                );
        
                if (!userLevel) {
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