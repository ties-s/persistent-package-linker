import * as path from 'path';
import * as fs from 'fs-extra';
import { packageRoot } from '../root-path';
import { log } from '../log';

const HOOKS = ['postinstall', 'postuninstall'];

let name = path.resolve('./hook.sh');
// console.log(__dirname, __filename, name);
const hookDir = packageRoot.then(root => `${root}/node_modules/.hooks`);
const hookCode = fs.readFile(path.resolve(__dirname, '../../hook.sh'), 'utf8');

export async function checkHook(hook: string): Promise<boolean> {
    return hookDir.then(async dir => {
        return fs.pathExists(`${dir}/${hook}`).then(exists => {
            return exists ? fs.readFile(`${dir}/${hook}`).then(content => content.includes('ppl-relink')) : false;
        })
    })
}

export async function createHook(hook: string) {
    return Promise.all([hookDir, hookCode]).then(data => {
        return fs.outputFile(`${data[0]}/${hook}`, data[1].toString(), { mode: 0o766 });
    })
}

export async function deleteHook(hook: string): Promise<boolean> {
    return hookDir.then(async dir => {
		let p = `${dir}/${hook}`;
        return fs.pathExists(p).then(exists => exists ? fs.remove(p).then(() => true) : exists )
    })
}

export async function createHooks() {
    return Promise.all(HOOKS.map(h => createHook(h)));
}

export async function deleteHooks() {
    return Promise.all(HOOKS.map(h => deleteHook(h))).then(bs => bs.reduce((a, b) => b ? a++ : a, 0));;
}

export async function verifyHooks(logAll: boolean = false) {
	
	// Make created hooks null
	return Promise.all(HOOKS.map(hook => checkHook(hook).then(e => e ? null : hook)))
		// Filter out created hooks
		.then(hns => hns.filter(hn => hn !== null))
		// Create hooks
		.then(hs => hs.map(h => createHook(h).then(() => h)))
		.then(hs => { hs.forEach(h => `(ppl hook) ${h} hook created`); });

}

export const setupHook = () => {
    return verifyHooks(true);
};

