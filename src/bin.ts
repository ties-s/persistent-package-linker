#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import {
    linkAll,
    linkPackage,
    linkSelf,
    unlinkPackage,
    setupHook,
    postInstall,
    setupLinking
} from './actions';

process.on('unhandledRejection', (reason, p) => {
   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

program
   .command('link [packages...]')
   .action(packages => {
	   console.log(packages);
	   if(packages.length)  linkPackage(packages);
       else             	linkSelf();
   })

program
   .command('link-file')
   .action(linkAll)

program
   .command('post-install')
   .action(postInstall)

program
   .command('unlink <package>')
   .action(unlinkPackage)

program
   .command('setup')
   .action(setupLinking)

program.parse(process.argv);
