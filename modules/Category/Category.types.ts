import User from "../User/User.entity";

export interface CategoryBody {
    title: string;
    color: string;
    icon: string;
    userId: number;
    user?: User;
}