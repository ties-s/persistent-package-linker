import { linkRoot } from './root-path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { projectRoot } from './actions/paths';

export default class JSONFile<T extends object> {
    
    private path(cwd: string) {
		return `${projectRoot(cwd)}/${this.fileName}`
	}

    constructor(private fileName: string, private defaultValue?: T){
    }

    async get(cwd = process.cwd()): Promise<T> {
		let path = this.path(cwd)
		return fs.pathExists(path)
			.then(null, 
				err => { 
					console.error(chalk.red(`[error] Error while verifing ${this.fileName}`), err); 
				})
			.then(exists => {
				//if(!exists) console.error(chalk.blue('no file, need use default value', path, JSON.stringify(this.defaultValue)));
				return exists;
			})
			.then(
				exists => exists ? fs.readJSON(path) : this.defaultValue,
				err => { console.error(chalk.red(`[error] Error while reading ${this.fileName}`), err); }
			);
    }

    async write(data, create = false, cwd = process.cwd()){
		let path = this.path(cwd)
		return fs.pathExists(path)
			.then(null, err => { 
				console.error(chalk.red(`[error] Error while verifing ${this.fileName}`), err); 
			})
			.then(exists => {
				if(!exists && !create){
					throw new Error(`${this.fileName} does not exist (${exists} | ${create})`);
				}
			})
			.then(
				(): Promise<void> => fs.outputJSON(path, data, { spaces: <any>'\t' }),
				err => { 
					console.error(chalk.red(`[error] Error while writing ${this.fileName}`), err);
					throw err;
				}
			);
    }

}