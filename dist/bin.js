#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var actions_1 = require("./actions");
process.on('unhandledRejection', function (reason, p) {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
program
    .command('link [packages...]')
    .action(function (packages) {
    console.log(packages);
    if (packages.length)
        actions_1.linkPackage(packages);
    else
        actions_1.linkSelf();
});
program
    .command('link-file')
    .action(actions_1.linkAll);
program
    .command('post-install')
    .action(actions_1.postInstall);
program
    .command('unlink <package>')
    .action(actions_1.unlinkPackage);
program
    .command('setup')
    .action(actions_1.setupLinking);
program.parse(process.argv);
//# sourceMappingURL=bin.js.map