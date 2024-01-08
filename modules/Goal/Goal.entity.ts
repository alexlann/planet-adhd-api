import { IsDefined } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../BaseEntity";
import User from "../User/User.entity";
import Task from "../Task/Task.entity";
import { StatusType } from "../constants";

@Entity()
export default class Goal extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined({ always: true })
    @Column()
    title: string;

    @IsDefined({ always: true })
    @Column()
    reward: string;

    @Column()
    notes: string;

    @IsDefined({ always: true })
    @Column()
    startTime: string;

    @IsDefined({ always: true })
    @Column()
    stopTime: string;

    @Column({
        type: "enum",
        enum: StatusType,
        default: StatusType.NotStarted,
    })
    status: StatusType;

    @IsDefined()
    @Column({ default: false })
    completed: boolean;

    @IsDefined({ always: true })
    @ManyToOne(() => User, (user) => user.tasks)
    user: User;

    @OneToMany(() => Task, (task) => task.goal, {
        cascade: true,
    })
    tasks: Task[];
}