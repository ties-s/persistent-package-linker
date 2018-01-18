#!/usr/bin/env node

import * as path from 'path';
const link = require('link-persistent');

console.log('-----')
console.log(process.cwd())
console.log(process.env._)
console.log(__dirname)
console.log(__filename)
console.log('-----')

const rootPath = path.resolve(process.env._, '../../..');
console.log(rootPath);

link.linkAll();