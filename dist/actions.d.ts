export declare const postInstall: () => void;
export declare const linkPackage: (packages: string[]) => Promise<void>;
export declare const unlinkPackage: (packages: string[]) => Promise<void>;
export declare const linkAll: () => Promise<void>;
export declare const linkSelf: () => void;
export declare const setupLinking: () => Promise<void>;
export declare const setupHook: () => Promise<void>;
