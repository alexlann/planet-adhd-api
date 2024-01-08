import User from "../User/User.entity";
import { StatusType } from "../constants";

export interface GoalBody {
    title: string;
    reward: string;
    notes?: string;
    startTime: string;
    stopTime: string;
    userId: number;
    completed?: boolean;
    status: StatusType;
    user?: User;
}