import { log } from "../log";
import { linkFile, LinkFile } from "./paths";
import { execPromise } from "../util";

export async function unlinkPackage(packages: string[]) {
    log.info(`Unlinking package(s): '${packages.join(`' '`)}'`);
    // unlink package
    return execPromise(`npm unlink ${packages.join(' ')}`)
        // log linking
        .then(res =>  {
			if(res.err) log.warning('(npm unlink) Warning while unlinking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
            log.success('(npm unlink) Unlinked package(s): \n=> ' + res.out.trim().replace('\n', '\n=> '))
        }, err => { log.error('Error while unlinking: \n', err); })
        // get link file
        .then(() => linkFile.get())
        // return data if changed
        .then((data: LinkFile) => {
			const inFile = packages.filter(p => data.links.includes(p))
			// return notInFile.length ? { isLinked: data.isLinked, links: data.links.concat(notInFile)} : null;
			if (inFile.length) {
				const write = { isLinked: data.isLinked, links: data.links.filter(l => !inFile.includes(l)) };
				return linkFile.write(write, true).then(() => {
					const diff = packages.length - inFile.length;
					log.info(`(ppl link file) Deleted ${inFile.length} package(s) from package-links.json`
						+ (diff > 0 ? `, ${diff} were already not in package-links.json` : ''));
				});
			} else {
				log.info(`(ppl link file) ${packages.length} of ${packages.length} were already not in package-links.json`);
			}
		})
        // log message
        .then(message => { log.success('Done!'); })
        .catch(err => { log.error('Unexpected error', err); });

}