import { execPromise } from "../util";
import { log } from "../log";
import { linkFile } from "./paths";
import * as path from "path";

export async function relink(cwd: string = process.cwd()) {
	log.info('Re-linking all packages from package-links.json')
	return linkFile.get(cwd)
		.then(res => res.links.join(' '))
		.then(res =>  res.length ? execPromise('npm link --ignore-scripts ' + res, { cwd: cwd }) : null)
		.then(res =>  {
			if(res && res.err) log.warning('Warning while linking: \n' + res.err.split('\n').map(l => `> ${l.trim()}`).join('\n'));
			if(res) log.success('Linked package(s):\n' + res.out.split('\n').map(l => `> ${l.split(path.sep).pop()}: ${l}`).join('\n'));
			else log.info('nothing to link');
		}, err => { log.error('Error while linking: \n', err); })
		.then(message => { log.success('Done!'); })
		.catch(err => { log.error('Unexpected error', err); });
}