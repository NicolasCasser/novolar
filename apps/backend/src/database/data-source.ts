import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

config({
  path: resolve(process.cwd(), '../../.env'),
});

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  ssl: process.env.POSTGRES_SSL === 'true',

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
});