import 'reflect-metadata'
import path from 'path'
import { DataSource } from 'typeorm'
import chalk from "chalk";

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'admin',
  database: 'ykon',
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, 'entities/*.js')
  ],
  migrations: [
    path.join(__dirname, 'migrations/*.js')
  ],
  subscribers: [
    path.join(__dirname, 'subscribers/*.js')
  ],
  connectorPackage: 'mysql2'
})

export async function initializeDatabase() {
  await AppDataSource.initialize().then(async () => {
    console.log(chalk.green('[DONE]') + ' Database has been connected.')
  }).catch(console.log)
}
