import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

config({
  path: resolve(process.cwd(), '../../.env'),
});

export default new DataSource({
  type: 'postgres',
  host: process.env.TEST_POSTGRES_HOST || 'localhost',
  port: Number(process.env.TEST_POSTGRES_PORT),
  username: process.env.TEST_POSTGRES_USER,
  password: process.env.TEST_POSTGRES_PASSWORD,
  database: process.env.TEST_POSTGRES_DB,

  ssl: process.env.TEST_POSTGRES_SSL === 'true',

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
});