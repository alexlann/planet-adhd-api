import Category from "../Category/Category.entity";
import Goal from "../Goal/Goal.entity";
import User from "../User/User.entity";
import { StatusType } from "../constants";
import { TaskImportance } from "./Task.constants";

export interface TaskBody {
    title: string;
    reward: string;
    importance: TaskImportance;
    userId: number;
    user?: User;
    categoryId: number;
    // TODO: is dit dan ook nodig en nodig in app ook?c
    // categoryId?: number;
    category?: Category;
    goalId: number;
    // goalId?: number;
    goal?: Goal;
    status: StatusType;
    completd?: boolean;
    startTime: string;
    stopTime: string;
    notes?: string;
}