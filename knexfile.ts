import type { Knex } from "knex";
import dotenv from 'dotenv'
import path from "path";

// Tentukan path file .env berdasarkan environment
const envPath = process.env.NODE_ENV === 'test' ? 
  '.env.test' : '.env';

dotenv.config({ path: envPath });

const commonConfig: Knex.Config = {
    client: 'pg',
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: path.join(__dirname, 'database/migrations'),
    }
};

export const onUpdateTrigger = (table: string) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`;

const configs: { [key: string]: Knex.Config } = {
    development: {
        ...commonConfig,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        }
    },
    test: {
        ...commonConfig,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        }
    },
    production: {
        ...commonConfig,
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        }
    }
};

export default configs;