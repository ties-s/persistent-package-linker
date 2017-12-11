"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var root_path_1 = require("./root-path");
var fs = require("fs-extra");
var chalk_1 = require("chalk");
var JSONFile = (function () {
    function JSONFile(fileName, defaultValue) {
        var _this = this;
        this.fileName = fileName;
        this.defaultValue = defaultValue;
        this.path = root_path_1.linkRoot.then(function (rootPath) { return rootPath + "/" + _this.fileName; });
    }
    JSONFile.prototype.get = function () {
        var _this = this;
        return this.path.then(function (path) {
            return fs.pathExists(path)
                .then(null, function (err) {
                console.error(chalk_1.default.red("[error] Error while verifing " + _this.fileName), err);
            })
                .then(function (exists) {
                //if(!exists) console.error(chalk.blue('no file, need use default value', path, JSON.stringify(this.defaultValue)));
                return exists;
            })
                .then(function (exists) { return exists ? fs.readJSON(path) : _this.defaultValue; }, function (err) { console.error(chalk_1.default.red("[error] Error while reading " + _this.fileName), err); });
        });
    };
    JSONFile.prototype.write = function (data, create) {
        var _this = this;
        if (create === void 0) { create = false; }
        return this.path.then(function (path) {
            return fs.pathExists(path)
                .then(null, function (err) {
                console.error(chalk_1.default.red("[error] Error while verifing " + _this.fileName), err);
            })
                .then(function (exists) {
                if (!exists && !create) {
                    throw new Error(_this.fileName + " does not exist (" + exists + " | " + create + ")");
                }
            })
                .then(function () { return fs.outputJSON(path, data, { spaces: '\t' }); }, function (err) {
                console.error(chalk_1.default.red("[error] Error while writing " + _this.fileName), err);
                throw err;
            });
        });
    };
    return JSONFile;
}());
exports.default = JSONFile;
//# sourceMappingURL=json-file.js.map