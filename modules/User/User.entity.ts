import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    OneToMany,
    OneToOne,
} from "typeorm";
import { hash, compare } from "bcrypt";
import { UserRole } from "./User.constants";
import { BaseEntity } from "../BaseEntity";
import { IsDefined, IsEmail } from "class-validator";
import Task from "../Task/Task.entity";
import Category from "../Category/Category.entity";
import Goal from "../Goal/Goal.entity";
import UserLevel from "../UserLevel/UserLevel.entity";

@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined({ always: true })
    @IsEmail(undefined, { always: true })
    @Column({ unique: true })
    email: string;

    @IsDefined({ groups: ["create"] })
    @Column({ select: false })
    password: string;

    @IsDefined({ always: true })
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.User,
    })
    role: UserRole;

    @OneToMany(() => Task, (task) => task.user, {
        cascade: true,
    })
    tasks: Task[];

    @OneToMany(() => Category, (category) => category.user, {
        cascade: true,
    })
    categories: Category[];

    @OneToMany(() => Goal, (goal) => goal.user, {
        cascade: true,
    })
    goals: Goal[];
    
    @OneToOne(() => UserLevel, (userLevel) => userLevel.user, {
        cascade: true,
    })
    userLevel: UserLevel;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await hash(this.password, 10);
        }
    }

    async checkPassword(passwordToCheck: string) {
        return await compare(passwordToCheck, this.password);
    }

    isAdmin() {
        return this.role === UserRole.Admin;
    }
}
