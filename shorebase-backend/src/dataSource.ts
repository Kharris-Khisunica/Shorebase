import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "./config/config.js";

export const AppDataSource = new DataSource({
    type: config.dbMainType,
    host: config.dbMainHost,
    port: config.dbMainPort,
    username: config.dbMainUsername,
    password: config.dbMainPassword,
    database: config.dbMainDatabase,
    synchronize: false,
    logging: config.dbMainLogging,
    entities: ["src/entity/**/*{.ts,.js}", "dist/entity/**/*{.ts,.js}"],
    migrations: ["src/migration/*{.ts,.js}", "dist/migration/*{.ts,.js}"],
    subscribers: [],
});
