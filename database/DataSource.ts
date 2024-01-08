import "reflect-metadata";
import { DataSource } from "typeorm";
import Category from "../modules/Category/Category.entity";
import User from "../modules/User/User.entity";
import Task from "../modules/Task/Task.entity";
import Goal from "../modules/Goal/Goal.entity";
import Level from "../modules/Level/Level.entity";
import UserLevel from "../modules/UserLevel/UserLevel.entity";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // turn of to run local
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: true,
    logging: false,
    entities: [Task, User, Category, Goal, Level, UserLevel],
    migrations: ["./dist/migration/*.{ts, js}"],
    subscribers: [],
});
