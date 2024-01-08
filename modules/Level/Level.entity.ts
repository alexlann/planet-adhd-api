import { IsDefined } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "../BaseEntity";
import User from "../User/User.entity";
import UserLevel from "../UserLevel/UserLevel.entity";

@Entity()
export default class Level extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @IsDefined({ always: true })
    @Column({ unique: true })
    levelNumber: number;

    @IsDefined({ always: true })
    @Column({ unique: true })
    requiredTotalScore: number;

    @IsDefined({ always: true })
    @Column({ unique: true })
    maxTotalScore: number;

    @IsDefined({ always: true })
    @Column({ unique: true })
    maxScore: number;

    @OneToMany(() => UserLevel, (userLevel) => userLevel.level, {
        cascade: true,
    })
    userLevels: UserLevel[];
}