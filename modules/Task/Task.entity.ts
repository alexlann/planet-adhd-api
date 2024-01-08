import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../BaseEntity";
import User from "../User/User.entity";
import Category from "../Category/Category.entity";
import Goal from "../Goal/Goal.entity";
import { TaskImportance } from "./Task.constants";
import { StatusType } from "../constants";

@Entity()
export default class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined({ always: true })
    @Column()
    title: string;

    @Column({
        type: "enum",
        enum: TaskImportance,
        default: TaskImportance.low,
    })
    importance: TaskImportance;

    @IsDefined({ always: true })
    @Column()
    reward: string;
    
    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.NotStarted,
    })
    status: StatusType;
    
    @IsDefined({ always: true })
    @Column()
    startTime: string;

    @IsDefined({ always: true })
    @Column()
    stopTime: string;

    @Column()
    notes: string;

    @IsDefined()
    @Column({ default: false })
    completed: boolean;

    @IsDefined({ always: true })
    @ManyToOne(() => User, (user) => user.tasks)
    user: User;

    // TODO: testen met nieuwe lege db
    // @Column({ nullable: true })
    @ManyToOne(() => Category, (category) => category.tasks)
    category: Category;

    // @Column({ nullable: true })
    @ManyToOne(() => Goal, (goal) => goal.tasks)
    goal: Goal;
}