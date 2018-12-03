import * as path from 'path';
import * as fs from 'fs-extra';
import { packageRoot } from '../root-path';
import { log } from '../log';

let name = path.resolve('./hook.sh');
// console.log(__dirname, __filename, name);
const hookPath = packageRoot.then(root => `${root}/node_modules/.hooks/postinstall`);
const hookCode = fs.readFile(path.resolve(__dirname, './hook.js'), 'utf8');

export async function checkHook(): Promise<boolean> {
    return hookPath.then(async path => {
        return fs.pathExists(path).then(exists => {
            return exists ? fs.readFile(path).then(content => content.includes('ppl link-file')) : false;
        })
    })
}

export async function createHook() {
    return Promise.all([hookPath, hookCode]).then(data => {
        // console.log(data[1]);
        return fs.outputFile(data[0], data[1].toString(), { mode: 0o766 });
    })
}

export async function deleteHook() {
    return hookPath.then(async path => {
        return fs.pathExists(path).then(exists => exists ? fs.remove(path).then(() => true) : exists )
    })
}

export async function verifyHook(logAll: boolean = false) {
    return checkHook().then(async created => {
        if(created) {
            if(logAll) log.info('(ppl hook) Hook already in place');
            return null;
        } else {
            return createHook().then(() => {
                log.success('(ppl hook) Hook created');
            });
        }
    })
}

export const setupHook = () => {
    return verifyHook(true);
};