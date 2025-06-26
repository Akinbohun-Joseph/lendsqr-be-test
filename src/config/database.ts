import knex from 'knex';


import configur from '../knexfile'

import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/migrations',
  },
  seeds: {
    directory: './src/seeds',
  },
};

export const db = knex(config);