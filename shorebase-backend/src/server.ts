import "reflect-metadata";
import config from "./config/config.js";
import app from "./app.js";
import { AppDataSource } from "./dataSource.js";

AppDataSource.initialize()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    })
    .catch((error) => console.error(error));
