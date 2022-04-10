import { DataSource } from "typeorm";
import {Container} from "typedi";

const createDatasource = async () => {
    const dataSource = new DataSource({
        type: "postgres",
        host: process.env.POSTGRES_HOST,
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        entities: ["./src/model/*.ts"],
        synchronize: true,
        logging: true
    });

    await dataSource.initialize();

    Container.set(DataSource, dataSource);
}

export {createDatasource};
