#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var link = require('link-persistent');
console.log('-----');
console.log(process.cwd());
console.log(process.env._);
console.log(__dirname);
console.log(__filename);
console.log('-----');
var rootPath = path.resolve(process.env._, '../../..');
console.log(rootPath);
link.linkAll();
//# sourceMappingURL=hook.js.map