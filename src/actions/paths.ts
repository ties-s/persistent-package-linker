import JSONFile from "../json-file";

export interface LinkFile {
    isLinked: boolean;
    links: string[];
}

export const linkFile = new JSONFile<LinkFile>('package-links.json', { isLinked: null, links: [] });
