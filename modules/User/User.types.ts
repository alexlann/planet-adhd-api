import UserLevel from "../UserLevel/UserLevel.entity";
import { UserRole } from "./User.constants";

export interface UserBody {
    email: string;
    password?: string;
    role: UserRole;
    userLevelId: number;
    userLevel?: UserLevel;
}