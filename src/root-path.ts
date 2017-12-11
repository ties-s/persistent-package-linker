import * as fs from 'fs-extra';
import * as path from 'path';

const check = (searchPath: string, checkFile: string = 'package.json') => {
    return fs.pathExists(path.resolve(searchPath, checkFile))
}
  
const find = (searchPath: string, checkFile?: string): Promise<string> => {
    return check(searchPath, checkFile).then((contains) => {
        return contains ? searchPath : find(searchPath.split(path.sep).slice(0, -1).join(path.sep), checkFile);
    });
};


//console.log('[root-path] PWD:', process.env.PWD);
//console.log('[root-path] __dirname', __dirname);

const pwd = process.env.PWD.split(path.sep)
export const packageRoot    = pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules' ? Promise.resolve(pwd.slice(0, -2).join(path.sep)) : find(process.env.PWD);
export const linkRoot       = packageRoot;

packageRoot.then(p => {
    //console.log('[root-path] resolved:', p);
    return p;
})