import { linkRoot } from './root-path';
import * as fs from 'fs-extra';
import chalk from 'chalk';

export default class JSONFile<T extends object> {
    
    private path: Promise<string>;

    constructor(private fileName: string, private defaultValue?: T){
        this.path = linkRoot.then(rootPath => `${rootPath}/${this.fileName}`);
    }

    get(): Promise<T> {
        return this.path.then(path => {
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
        })
    }

    write(data, create = false){
        return this.path.then(path => {
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
                    (): Promise<void> => fs.outputJSON(path, data, { spaces: '\t' }),
                    err => { 
                        console.error(chalk.red(`[error] Error while writing ${this.fileName}`), err);
                        throw err;
                    }
                );
        })
    }

}