import { initializeDatabase } from './database'
import chalk from "chalk";

async function bootstrap(): Promise<void> {
  try {
    mp.events.delayInitialization = true
    await initializeDatabase()
    await console.log(chalk.yellow('[INFO]') + ' Importing modules...')
    await import ('./modules')
    await console.log(chalk.green('[DONE]') + ' The modules has been imported.')
    mp.events.delayInitialization = false
  } catch (e) {
    console.log(chalk.red('[ERROR]') + ' error')
    process.exit()
  }
}

bootstrap()
