import { log } from "../log";
import { verifyHook } from "./hook";
import { execPromise } from "../util";
import { linkFile } from "./paths";

export function linkPackage(packages: string[]) {
    log.info(`Linking package(s): '${packages.join(`' '`)}'`);
    return verifyHook(true)

        .then(() => execPromise(`npm link ${packages.join(' ')} --ignore-scripts`))
        // log linking
        .then(res =>  {
            if(res.err) log.warning('(npm link) Warning while linking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
            log.success('(npm link) Linked package(s): \n=> ' + res.out.trim().replace('\n', '\n=> '))
        }, err => { log.error('(npm link) Error while linking: \n', err); })
        // get link file
        .then(() => linkFile.get())
        // return data if changed
        .then(data => {
			const notInFile = packages.filter(p => !data.links.includes(p))
			// return notInFile.length ? { isLinked: data.isLinked, links: data.links.concat(notInFile)} : null;
			if (notInFile.length) {
				const write = { isLinked: data.isLinked, links: data.links.concat(notInFile)};
				return linkFile.write(write, true).then(() => {
					const diff = packages.length - notInFile.length;
					log.info(`(ppl link file) Added ${notInFile.length} package(s) to package-links.json`
						+ (diff > 0 ? `, ${diff} were already in package-links.json` : ''));
				});
			} else {
				log.info(`(ppl link file) ${packages.length} of ${packages.length} were already in package-links.json`);
			}
		})
        // log message
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });

};