import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../BaseEntity";
import Task from "../Task/Task.entity";
import User from "../User/User.entity";

@Entity()
export default class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined({ always: true })
    @IsNotEmpty()
    @IsString()
    @Column()
    title: string;

    @IsDefined({ always: true })
    @IsNotEmpty()
    @IsString()
    @Column()
    color: string;

    @IsDefined({ always: true })
    @IsNotEmpty()
    @IsString()
    @Column()
    icon: string;

    @OneToMany(() => Task, (task) => task.category, {
        cascade: true,
    })
    tasks: Task[];

    @IsDefined({ always: true })
    @ManyToOne(() => User, (user) => user.categories)
    user: User;
}