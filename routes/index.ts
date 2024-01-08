import { NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import NotFoundError from "../errors/NotFoundError";
import { authJwt, authLocal, withRole } from "../middleware/auth";
import AuthController from "../modules/User/Auth.controller";
import { UserRole } from "../modules/User/User.constants";
import * as path from "path";
import UserController from "../modules/User/User.controller";
import CategoryController from "../modules/Category/Category.controller";
import TaskController from "../modules/Task/Task.controller";
import GoalController from "../modules/Goal/Goal.controller";
import LevelTController from "../modules/Level/Level.controller"
import UserLevelTController from "../modules/UserLevel/UserLevel.controller";

// catch error since Express doesn't catch errors in async functions
// this will catch the controller method + will send the error through next() method
// this way we don't have to do try/catch in every controller method
const useMethod =
    (func: (req: any, res: Response, next: NextFunction) => Promise<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (err) {
            next(err);
        }
    };

const registerOnboardingRoutes = (router: Router) => {
    // routes available when not logged in
    const authController = new AuthController();
    router.post("/login", authLocal, useMethod(authController.login));
    router.post("/register", useMethod(authController.register));
    if (process.env.ENV === "development") {
        router.post("/dev/registeradmin", useMethod(authController.registerAdmin));
    }
};

const registerAdminRoutes = (router: Router) => {
    const adminRouter = Router();

    // admin routes
    const userController = new UserController();
    adminRouter.get("/users", useMethod(userController.all));
    adminRouter.post("/users", useMethod(userController.create));

    const LevelController = new LevelTController();
    adminRouter.get("/levels", useMethod(LevelController.all));
    adminRouter.post("/levels", useMethod(LevelController.create));
    adminRouter.patch("/levels/:id", useMethod(LevelController.update));
    adminRouter.delete("/levels/:id", useMethod(LevelController.delete));

    const UserLevelController = new UserLevelTController();
    adminRouter.delete("/user-levels/:id", useMethod(UserLevelController.delete));

    router.use(withRole(UserRole.Admin), adminRouter);
};

const registerAuthenticatedRoutes = (router: Router) => {
    // routes available when logged in
    const authRouter = Router();

    const categoryController = new CategoryController();
    authRouter.get("/categories", useMethod(categoryController.all));
    authRouter.get("/categories/:id", useMethod(categoryController.find));
    authRouter.post("/categories", useMethod(categoryController.create));
    authRouter.patch("/categories/:id", useMethod(categoryController.update));
    authRouter.delete("/categories/:id", useMethod(categoryController.delete));

    const goalController = new GoalController();
    authRouter.get("/goals", useMethod(goalController.all));
    authRouter.get("/goals/:id", useMethod(goalController.find));
    authRouter.post("/goals", useMethod(goalController.create));
    authRouter.patch("/goals/:id", useMethod(goalController.update));
    authRouter.delete("/goals/:id", useMethod(goalController.delete));

    const taskController = new TaskController();
    authRouter.get("/tasks", useMethod(taskController.all));
    authRouter.get("/tasks/:id", useMethod(taskController.find));
    authRouter.post("/tasks", useMethod(taskController.create));
    authRouter.patch("/tasks/:id", useMethod(taskController.update));
    authRouter.delete("/tasks/:id", useMethod(taskController.delete));

    const userController = new UserController();
    authRouter.get("/users/:id", useMethod(userController.find));
    authRouter.patch("/users/:id", useMethod(userController.update));
    authRouter.delete("/users/:id", useMethod(userController.delete));

    const LevelController = new LevelTController();
    authRouter.get("/levels/:id", useMethod(LevelController.find));

    const UserLevelController = new UserLevelTController();
    authRouter.get("/user-levels", useMethod(UserLevelController.all));
    authRouter.get("/user-levels/:id", useMethod(UserLevelController.find));
    authRouter.get("/user-levels/user/:id", useMethod(UserLevelController.findForUser));
    authRouter.post("/user-levels", useMethod(UserLevelController.create));
    authRouter.patch("/user-levels/:id", useMethod(UserLevelController.update));

    registerAdminRoutes(authRouter);

    // authenticated routes use authJWT
    router.use(authJwt, authRouter);
}

const registerRoutes = (app: Router) => {
    // public folder
    app.use("/public", express.static(path.resolve(__dirname, "../public")));

    // onboarding routes (login, ...)
    registerOnboardingRoutes(app);

    // authenticated routes (authentication required)
    registerAuthenticatedRoutes(app);

    // fallback route, return our own 404 instead of default
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError());
    });
};

export { registerRoutes };
