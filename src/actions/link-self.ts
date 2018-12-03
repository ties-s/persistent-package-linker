import { log } from "../log";
import { execPromise } from "../util";
import { deleteHook, createHook } from "./hook";

export async function linkSelf() {
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