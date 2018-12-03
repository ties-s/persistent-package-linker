import chalk from "chalk";

export const log = {
    success: (...args) => {
        console.log(...['[SUCCESS]', ...args].map(e => typeof e === 'string' ? chalk.green(e) : e))
    },
    error: (...args) => {
        console.log(...['[ERROR]', ...args].map(e => typeof e === 'string' ? chalk.red(e) : e))
    },
    warning: (...args) => {
        console.log(...['[WARNING]', ...args].map(e => typeof e === 'string' ? chalk.yellow(e) : e))
    },
    info: (...args) => {
        console.log(...['[INFO]', ...args].map(e => typeof e === 'string' ? chalk.blueBright(e) : e))
    }
}