// Postgres DB config interface
export interface DbConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

const pgConfig: DbConfig = {
    user: process.env.PG_USER || '',
    host: process.env.PG_HOST || '',
    database: process.env.PG_DB || '',
    password: process.env.PG_PASS || '',
    port: Number(process.env.PG_PORT) || 5432,
};

export default pgConfig;
