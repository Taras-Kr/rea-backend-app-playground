import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'reflect-metadata';
import * as process from 'node:process';
import * as path from "node:path"; // Важливо для TypeORM

dotenv.config();

// Опції підключення до бази даних для TypeORM CLI
// Ці опції повинні відповідати активній конфігурації у вашому .env файлі та app.module.ts
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, '/../**/*.entity.{js,ts}')],
  migrations: [path.join(__dirname, '/../migrations/*.{js,ts}')],
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);