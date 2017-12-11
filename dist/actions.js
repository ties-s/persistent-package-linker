"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_file_1 = require("./json-file");
var chalk_1 = require("chalk");
var fs = require("fs-extra");
var exec = require('child_process').exec;
var root_path_1 = require("./root-path");
var path = require("path");
var linkFile = new json_file_1.default('package-links.json', { isLinked: null, links: [] });
var execPromise = function () {
    var opts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        opts[_i] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        exec.apply(void 0, opts.concat(function (error, stdout, stderr) {
            if (error)
                reject(error);
            else
                resolve({ out: stdout.trim(), err: stderr.trim() });
        }));
    });
};
var log = {
    success: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['[SUCCESS]'].concat(args).map(function (e) { return typeof e === 'string' ? chalk_1.default.green(e) : e; }));
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['[ERROR]'].concat(args).map(function (e) { return typeof e === 'string' ? chalk_1.default.red(e) : e; }));
    },
    warning: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['[WARNING]'].concat(args).map(function (e) { return typeof e === 'string' ? chalk_1.default.yellow(e) : e; }));
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['[INFO]'].concat(args).map(function (e) { return typeof e === 'string' ? chalk_1.default.blue(e) : e; }));
    }
};
exports.postInstall = function () {
};
exports.linkPackage = function (packageName) {
    log.info("Linking package '" + packageName + "'");
    return verifyHook(true)
        .then(function () { return execPromise("npm link " + packageName + " --ignore-scripts"); })
        .then(function (res) {
        if (res.err)
            log.warning('[WARN] Warning while linking: \n', res.err);
        log.success('Linked package: ', res.out.trim());
    }, function (err) { log.error('Error while linking: \n', err); })
        .then(function () { return linkFile.get(); })
        .then(function (data) { return data.links.includes(packageName) ? null : { isLinked: data.isLinked, links: data.links.concat(packageName) }; })
        .then(function (data) { return data ? linkFile.write(data, true).then(function () { return true; }) : false; })
        .then(function (changed) { return changed === false ? log.info("Package '" + packageName + "' was already in package-links.json") : log.success("Package '" + packageName + "' added to package-links.json"); })
        .then(function (message) { log.success('Done!'); })
        .catch(function (err) { log.error('Unexpected error', err); });
};
exports.unlinkPackage = function (packageName) {
    log.info("Unlinking package '" + packageName + "'");
    // unlink package
    return execPromise('npm unlink ' + packageName)
        .then(function (res) {
        if (res.err)
            log.warning('Warning while unlinking: \n' + res.err.split('\n').map(function (l) { return "> " + l.trim(); }).join('\n'));
        log.success('Unlinked package: ', res.out);
    }, function (err) { log.error('Error while unlinking: \n', err); })
        .then(function () { return linkFile.get(); })
        .then(function (data) { return !data.links.includes(packageName) ? null : { isLinked: data.isLinked, links: data.links.filter(function (l) { return l != packageName; }) }; })
        .then(function (data) { return data ? linkFile.write(data, true).then(function () { return true; }) : false; })
        .then(function (changed) { return changed === false ? log.info("Package '" + packageName + "' already wasn't in package-links.json") : log.success("Package '" + packageName + "' removed from package-links.json"); })
        .then(function (message) { log.success('Done!'); })
        .catch(function (err) { log.error('Unexpected error', err); });
};
exports.linkAll = function () {
    log.info('Re-linking all packages from package-links.json');
    return Promise.all([linkFile.get(), root_path_1.packageRoot])
        .then(function (res) { return { data: res[0], path: res[1] }; })
        .then(function (res) { return { data: res.data.links.join(' '), path: res.path }; })
        .then(function (res) { return res.data.length ? execPromise('npm link --ignore-scripts ' + res.data, { cwd: res.path }) : null; })
        .then(function (res) {
        if (res && res.err)
            log.warning('Warning while linking: \n' + res.err.split('\n').map(function (l) { return "> " + l.trim(); }).join('\n'));
        if (res)
            log.success('Linked package(s):\n' + res.out.split('\n').map(function (l) { return "> " + l.split(path.sep).pop() + ": " + l; }).join('\n'));
        else
            log.info('nothing to link');
    }, function (err) { log.error('Error while linking: \n', err); })
        .then(function (message) { log.success('Done!'); })
        .catch(function (err) { log.error('Unexpected error', err); });
};
exports.linkSelf = function () {
    log.info('Linking package');
    var hadHook = false;
    deleteHook()
        .then(function (had) {
        if (had)
            log.info('Disabling hook');
        hadHook = had;
    })
        .then(function () { return execPromise('npm link --ignore-scripts'); })
        .then(function (res) {
        if (res.err)
            log.warning('Warning while linking: \n' + res.err.split('\n').map(function (l) { return "> " + l.trim(); }).join('\n'));
        log.success('Linked package:\n' + res.out.split('\n').map(function (l) { return "> " + l.trim(); }).join('\n'));
    }, function (err) { log.error('Error while linking: \n', err); })
        .then(function (had) {
        if (hadHook) {
            log.info('Re-enabling hook');
            return createHook();
        }
    })
        .then(function (message) { log.success('Done!'); })
        .catch(function (err) { log.error('Unexpected error', err); });
};
var hookCodeBash = [
    '#!/usr/bin/env bash',
    "ppl link-file && echo '[SUCCESS] relinked packages'"
].join('\n');
var hookCodeNode = [
    '#!/usr/bin/env node',
    "console.log(process.env)"
].join('\n');
var hookPath = root_path_1.packageRoot.then(function (root) { return root + "/node_modules/.hooks/postinstall"; });
var checkHook = function () {
    return hookPath.then(function (path) {
        return fs.pathExists(path).then(function (exists) {
            return exists ? fs.readFile(path).then(function (content) { return content.includes('ppl link-file'); }) : false;
        });
    });
};
var name = path.resolve('./hook.sh');
// console.log(__dirname, __filename, name);
var hookCode = fs.readFile(path.resolve(__dirname, './hook.sh'), 'utf8');
var createHook = function () {
    return Promise.all([hookPath, hookCode]).then(function (data) {
        // console.log(data[1]);
        return fs.outputFile(data[0], data[1].toString(), { mode: 502 });
    });
};
var deleteHook = function () {
    return hookPath.then(function (path) {
        return fs.pathExists(path).then(function (exists) { return exists ? fs.remove(path).then(function () { return true; }) : exists; });
    });
};
var verifyHook = function (logAll) {
    if (logAll === void 0) { logAll = false; }
    return checkHook().then(function (created) {
        if (created) {
            if (logAll)
                log.info('Hook already in place');
            return null;
        }
        else {
            return createHook().then(function () {
                log.success('Hook created');
            });
        }
    });
};
exports.setupHook = function () {
    return verifyHook(true);
};
//# sourceMappingURL=actions.js.map