import { Response, NextFunction } from "express";
import NotFoundError from "../../errors/NotFoundError";
import { AuthRequest } from "../../middleware/auth/auth.types";
import CategoryService from "./Category.service";
import { CategoryBody } from "./Category.types";

export default class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    all = async (
        // req: AuthRequest,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const categories = await this.categoryService.all(!req.user.isAdmin() && req.user.id);
        return res.json(categories);
    }

    find = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        const category = await this.categoryService.findOne(
            parseInt(req.params.id),
            !req.user.isAdmin() && req.user.id,
        );

        if (!category) {
            next(new NotFoundError());
            return;
        }

        return res.json(category);
    };

    create = async (
        // req: AuthRequest<{}, {}, CategoryBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        // if role user, change userId to id of user
        if(!req.user.isAdmin()) {
            req.body.user = req.user;
        }

        const category = await this.categoryService.create(req.body);
        return res.json(category);
    }

    update = async (
        // req: AuthRequest<{ id: string }, {}, CategoryBody>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const category = await this.categoryService.update(
                parseInt(req.params.id),
                req.body,
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!category) {
                next(new NotFoundError());
                return;
            }

            return res.json(category);

        } catch (error) {
            error(next);
        }
    };

    delete = async (
        // req: AuthRequest<{ id: string }>,
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const category = await this.categoryService.delete(
                parseInt(req.params.id),
                !req.user.isAdmin() && req.user.id,
            );
    
            if (!category) {
                next(new NotFoundError());
                return;
            }
            
            return res.json({});
                  
        } catch (error) {
            next(error);
        }
    };

};