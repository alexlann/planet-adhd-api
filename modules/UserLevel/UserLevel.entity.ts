import { IsDefined } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../BaseEntity";
import User from "../User/User.entity";
import Level from "../Level/Level.entity";

@Entity()
export default class UserLevel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined()
    @Column({ default: 0 })
    score: number;

    @IsDefined()
    @Column({ default: "" })
    reward: string;

    @IsDefined({ always: true })
    @OneToOne(() => User, (user) => user.userLevel)
    @JoinColumn()
    user: User;

    @IsDefined({ always: true })
    @ManyToOne(() => Level, (level) => level.userLevels)
    level: Level;
}