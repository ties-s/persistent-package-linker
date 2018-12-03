import { execPromise } from "../util";
import { log } from "../log";

export const setupLinking = () => {
    return execPromise('npm root -g')
    // log linking
    .then(res =>  {
        if(res.err) log.warning('Warning while getting npm root path: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
        log.info('Got npm root path:', res.out);
        return res.out;
    }, err => { log.error('Error while getting npm root path: \n', err); })
    // get link file
    .then((path) => execPromise('npm install ties-s/lifecycle#hooks-folder-fix -S', {
        cwd: `${path}/npm`
    }))
    .then(res =>  {
        if(res.err) log.warning('Warning while installing patched lifecycle package: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
        log.success('Installed patched lifecycle package:\n' + res.out.split('\n').map(l => `> ${l.trim()}`).join('\n'));
    }, err => { log.error('Error while installing patched lifecycle package: \n', err); })
    // log message
    .then(message => { log.success('Done!'); })
    .catch(err => { log.error('Unexpected error', err); });
}