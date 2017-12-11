export default class JSONFile<T extends object> {
    private fileName;
    private defaultValue;
    private path;
    constructor(fileName: string, defaultValue?: T);
    get(): Promise<T>;
    write(data: any, create?: boolean): Promise<void>;
}
