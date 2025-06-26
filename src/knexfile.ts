import type { Knex } from 'knex';
import dotenv from 'dotenv'
dotenv.config();

const configur: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number( process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
  },
  
  test: {
    client: 'mysql2',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: Number (process.env.TEST_DB_PORT )|| 3306,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    migrations: {
      directory: './src/migrations',
    },
  },
  
  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};



export default configur;

