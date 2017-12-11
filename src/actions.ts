import JSONFile from './json-file';
import chalk from 'chalk';
import * as fs from 'fs-extra';
const { exec } = require('child_process');
import { packageRoot } from './root-path';
import * as path from 'path';

interface LinkFile {
    isLinked: boolean;
    links: string[];
}

const linkFile = new JSONFile<LinkFile>('package-links.json', { isLinked: null, links: [] });

const execPromise = (...opts) => new Promise<{ out: any, err: any }>((resolve, reject) => {
    exec(...opts.concat((error, stdout, stderr) => {
        if(error)   reject(error);
        else        resolve({ out: stdout.trim(), err: stderr.trim() });
    }));
})

const log = {
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
        console.log(...['[INFO]', ...args].map(e => typeof e === 'string' ? chalk.blue(e) : e))
    }
}

export const postInstall = () => {

}

export const linkPackage = packageName => {
    log.info(`Linking package '${packageName}'`);
    return verifyHook(true)
        
        .then(() => execPromise(`npm link ${packageName} --ignore-scripts`))
        // log linking
        .then(res =>  { 
            if(res.err) log.warning('[WARN] Warning while linking: \n', res.err);
            log.success('Linked package: ', res.out.trim())
        }, err => { log.error('Error while linking: \n', err); })
        // get link file
        .then(() => linkFile.get())
        // return data if changed
        .then(data => data.links.includes(packageName) ? null : { isLinked: data.isLinked, links: data.links.concat(packageName)})
        // write if data changed
        .then(data => data ? linkFile.write(data, true).then(() => true) : false)
        // return message
        .then(changed => changed === false ? log.info(`Package '${packageName}' was already in package-links.json`) : log.success(`Package '${packageName}' added to package-links.json`))
        // log message
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });

};
    
export const unlinkPackage = packageName => {
    log.info(`Unlinking package '${packageName}'`);
    // unlink package
    return execPromise('npm unlink ' + packageName)
        // log linking
        .then(res =>  { 
            if(res.err) log.warning('Warning while unlinking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
            log.success('Unlinked package: ', res.out);
        }, err => { log.error('Error while unlinking: \n', err); })
        // get link file
        .then(() => linkFile.get())
        // return data if changed
        .then((data: LinkFile): LinkFile => !data.links.includes(packageName) ? null : { isLinked: data.isLinked, links: data.links.filter(l => l != packageName)} )
        // write if data changed
        .then((data: LinkFile) => data ? linkFile.write(data, true).then(() => true) : false)
        // return message
        .then((changed: boolean): void => changed === false ?  log.info(`Package '${packageName}' already wasn't in package-links.json`): log.success(`Package '${packageName}' removed from package-links.json`))
        // log message
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });

}

export const linkAll = () => {
    log.info('Re-linking all packages from package-links.json')
    return Promise.all([linkFile.get(), packageRoot])
        .then(res => { return { data: res[0], path: res[1] } })
        .then(res => { return { data: res.data.links.join(' '), path: res.path }; })
        .then(res =>  res.data.length ? execPromise('npm link --ignore-scripts ' + res.data, { cwd: res.path }) : null)
        .then(res =>  {
            if(res && res.err) log.warning('Warning while linking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
            if(res) log.success('Linked package(s):\n' + res.out.split('\n').map(l => `> ${l.split(path.sep).pop()}: ${l}`).join('\n'));
            else log.info('nothing to link');
        }, err => { log.error('Error while linking: \n', err); })
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });
};
    
export const linkSelf = () => {
    log.info('Linking package')

    let hadHook = false;

    deleteHook()
        .then(had => { 
            if(had) log.info('Disabling hook');
            hadHook = had 
        })
        .then(() => execPromise('npm link --ignore-scripts'))
        // log linking
        .then(res =>  { 
            if(res.err) log.warning('Warning while linking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
            log.success('Linked package:\n' + res.out.split('\n').map(l => `> ${l.trim()}`).join('\n'));
        }, err => { log.error('Error while linking: \n', err); })
        .then(had => { 
            if(hadHook){
                log.info('Re-enabling hook');
                return createHook();
            }
        })
        // get link file
        //.then(() => linkFile.get())
        // return data if changed
        //.then(data => data.isLinked ? null : { isLinked: true, links: data.links })
        // write if data changed
        //.then(data => data ? linkFile.write(data, true).then(() => true) : false)
        // return message
        //.then(changed => changed === false ?  log.info(`Link was already in package-links.json`) : log.success(`Linked package`))
        // log message
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });

};

const hookCodeBash = [
    '#!/usr/bin/env bash', 
    `ppl link-file && echo '[SUCCESS] relinked packages'`
].join('\n');

const hookCodeNode = [
    '#!/usr/bin/env node', 
    `console.log(process.env)`
].join('\n');

const hookPath = packageRoot.then(root => `${root}/node_modules/.hooks/postinstall`);

const checkHook = (): Promise<boolean> => {
    return hookPath.then(path => {
        return fs.pathExists(path).then(exists => {
            return exists ? fs.readFile(path).then(content => content.includes('ppl link-file')) : false;
        })
    })
}

let name = path.resolve('./hook.sh');
// console.log(__dirname, __filename, name);
const hookCode = fs.readFile(path.resolve(__dirname, './hook.sh'), 'utf8');

const createHook = () => {
    return Promise.all([hookPath, hookCode]).then(data => {
        // console.log(data[1]);
        return fs.outputFile(data[0], data[1].toString(), { mode: 0o766 });
    })
}

const deleteHook = () => {
    return hookPath.then(path => {
        return fs.pathExists(path).then(exists => exists ? fs.remove(path).then(() => true) : exists )
    })
}

const verifyHook = (logAll: boolean = false) => {
    return checkHook().then(created => {
        if(created) {
            if(logAll) log.info('Hook already in place');
            return null;
        } else {
            return createHook().then(() => {
                log.success('Hook created');
            });
        }
    })
}

export const setupHook = () => {
    return verifyHook(true);
};