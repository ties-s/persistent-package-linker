import * as path from 'path';
import * as fs from 'fs-extra';
import { packageRoot } from '../root-path';
import { log } from '../log';

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

export async function deleteHook(hook: string) {
    return hookDir.then(async dir => {
		let p = `${dir}/${hook}`;
        return fs.pathExists(p).then(exists => exists ? fs.remove(p).then(() => true) : exists )
    })
}

export async function verifyHooks(logAll: boolean = false) {
	
	return Promise.all(['postinstall', 'postuninstall'].map(hook => {

		return checkHook(hook).then(async created => {
			if(created) {
				if(logAll) log.info('(ppl hook) Hook already in place');
				return null;
			} else {
				return createHook(hook).then(() => {
					log.success(`(ppl hook) ${hook} hook created`);
				});
			}
		})
		
	}))
}

export const setupHook = () => {
    return verifyHooks(true);
};