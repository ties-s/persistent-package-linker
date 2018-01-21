import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

const check = (searchPath: string, checkFile: string = 'package.json') => {
    return fs.pathExists(path.resolve(searchPath, checkFile))
}

const find = (searchPath: string, checkFile?: string): Promise<string> => {
    return check(searchPath, checkFile).then((contains) => {
        return contains ? searchPath : find(searchPath.split(path.sep).slice(0, -1).join(path.sep), checkFile);
    });
};


//console.log('[root-path] PWD:', process.cwd());
//console.log('[root-path] __dirname', __dirname);

const pwd = process.cwd().split(path.sep)
    pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules' ? Promise.resolve(pwd.slice(0, -2).join(path.sep)) : find(process.cwd());

var packageRoot: Promise<string>;
if(pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules'){
    packageRoot = Promise.resolve(pwd.slice(0, -2).join(path.sep));
} else if(pwd.length > 2 && pwd[pwd.length - 3] == 'node_modules' && pwd[pwd.length - 2][0] == '@'){
    packageRoot = Promise.resolve(pwd.slice(0, -3).join(path.sep));
} else {
    packageRoot = find(process.cwd());
}

export { packageRoot };

export const linkRoot       = packageRoot;

packageRoot.then(p => {
    //console.log('[root-path] resolved:', p);
    return p;
})