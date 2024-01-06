import {DataSource} from "typeorm";
import {Container} from "typedi";

const createDatasource = async () => {
    const dataSource = new DataSource({
        // @ts-ignore
        type: process.env.POSTGRES_DATABASE_TYPE,
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_NAME,
        entities: ["./src/model/*.ts"],
        synchronize: false,
        logging: false
    });

    await dataSource.initialize();

    Container.set(DataSource, dataSource);
}

export {createDatasource};
