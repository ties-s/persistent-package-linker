"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var check = function (searchPath, checkFile) {
    if (checkFile === void 0) { checkFile = 'package.json'; }
    return fs.pathExists(path.resolve(searchPath, checkFile));
};
var find = function (searchPath, checkFile) {
    return check(searchPath, checkFile).then(function (contains) {
        return contains ? searchPath : find(searchPath.split(path.sep).slice(0, -1).join(path.sep), checkFile);
    });
};
//console.log('[root-path] PWD:', process.env.PWD);
//console.log('[root-path] __dirname', __dirname);
var pwd = process.env.PWD.split(path.sep);
exports.packageRoot = pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules' ? Promise.resolve(pwd.slice(0, -2).join(path.sep)) : find(process.env.PWD);
exports.linkRoot = exports.packageRoot;
exports.packageRoot.then(function (p) {
    //console.log('[root-path] resolved:', p);
    return p;
});
//# sourceMappingURL=root-path.js.map