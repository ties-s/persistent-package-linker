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
//console.log('[root-path] PWD:', process.cwd());
//console.log('[root-path] __dirname', __dirname);
var pwd = process.cwd().split(path.sep);
pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules' ? Promise.resolve(pwd.slice(0, -2).join(path.sep)) : find(process.cwd());
var packageRoot;
exports.packageRoot = packageRoot;
if (pwd.length > 2 && pwd[pwd.length - 2] == 'node_modules') {
    exports.packageRoot = packageRoot = Promise.resolve(pwd.slice(0, -2).join(path.sep));
}
else if (pwd.length > 2 && pwd[pwd.length - 3] == 'node_modules' && pwd[pwd.length - 2][0] == '@') {
    exports.packageRoot = packageRoot = Promise.resolve(pwd.slice(0, -3).join(path.sep));
}
else {
    exports.packageRoot = packageRoot = find(process.cwd());
}
exports.linkRoot = packageRoot;
packageRoot.then(function (p) {
    //console.log('[root-path] resolved:', p);
    return p;
});
//# sourceMappingURL=root-path.js.map