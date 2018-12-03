#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import { linkSelf } from './actions/link-self';
import { linkPackage } from './actions/link-package';
import { unlinkPackage } from './actions/unlink';
import { setupLinking } from './actions/setup';
import { relink } from './actions/relink';

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
   .action(relink)

program
   .command('unlink <package...>')
   .action(unlinkPackage)

program
   .command('setup')
   .action(setupLinking)

program.parse(process.argv);
