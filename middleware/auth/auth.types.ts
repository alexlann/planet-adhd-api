import { Request } from "express";
import User from "../../modules/User/User.entity";

// this might be done better, but quick fix for now
export interface AuthRequest<
    P = void,
    ResBody = void,
    ReqBody = void,
    ReqQuery = void,
    Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    user: User;
}
