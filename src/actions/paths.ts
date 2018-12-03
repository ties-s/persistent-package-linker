import JSONFile from "../json-file";
import { sep as PATH_SEP } from 'path';

export interface LinkFile {
    isLinked: boolean;
    links: string[];
}

export const linkFile = new JSONFile<LinkFile>('package-links.json', { isLinked: null, links: [] });


export function projectRoot(path: string) {

	let p = path.split(PATH_SEP);
	let l = p.length;

	if(l > 2 && p[l-2] == 'node_modules'){
		//                [l-2]        [l-1]
		// PROJECT_FOLDER/node_modules/package
		//                ^^^^^^^^^^^^
		return p.slice(0, -2).join(PATH_SEP);
	} else if(l > 2 && p[l-3] == 'node_modules' && p[l - 2][0] == '@'){
		//                [l-3]        [l-2]  [l-1]
		// PROJECT_FOLDER/node_modules/@scope/package
		//                ^^^^^^^^^^^^ ^
		return p.slice(0, -3).join(PATH_SEP);
	} else {
		return path.split('node_modules')[0];
	}

}