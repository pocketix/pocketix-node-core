declare global {
    namespace NodeJS {
        /**
         * Interface for the .env file
         */
        interface ProcessEnv {
            INFLUX_URL: string;
            INFLUX_ORG: string;
            INFLUX_TOKEN: string;
            INFLUX_BUCKET: string;
            INFLUX_USE_OVERRIDE_BUCKET: string;
            INFLUX_OVERRIDE_BUCKET: string;
            INFLUX_ERROR_BUCKET: string;
            INFLUX_LOGGING_BUCKET: string;
            INFLUX_LOGGING: string;
            PORT: string;
            POSTGRES_HASH: string;
            POSTGRES_USER: string;
            POSTGRES_PASSWORD: string;
            POSTGRES_HOST: string;
            POSTGRES_NAME: string;
            POSTGRES_DATABASE_TYPE: string,
            POSTGRES_DATABASE_PORT: string
        }
    }
}

export {};
