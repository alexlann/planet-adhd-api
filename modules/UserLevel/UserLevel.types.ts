import Level from "../Level/Level.entity";
import User from "../User/User.entity";

export interface UserLevelBody {
    score: number;
    reward: string;
    levelId: number;
    level?: Level;
    userId: number;
    user?: User;
}