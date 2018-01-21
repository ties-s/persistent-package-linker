# Persistent package linker (ppl)

In `npm@>=5` packages linked via `npm link` are lost if `npm install` is called, this package tries to fix that. 

**NOTE:** 
Currently only works with `npm@<5.1` because of a bug introduced in `npm@5.1`.  
**WORKAROUND:**
The bug resides in the package `npm-lifecycle` (dependency of `npm`) that doesn't seem to be maintained. To fix it, I created a fork of that package at [`ties-s/ppl-fix-npm-lifecycle`](https://github.com/ties-s/ppl-fix-npm-lifecycle). Installing this can be done via (macOS/Linux):

```bash
cd $(npm root -g)/npm # change dir to node's npm package 
npm install -S ties-s/ppl-fix-npm-lifecycle # install fork with fix (replaces buggy one)
```

*Would really appreciate it if someone on Windows could make a PR with a Windows fix, should be quite similar but I can't test it anywhere.*

## Installation
```bash
npm install -g persistent-package-linker
```

## Usage
### Link current package
```bash
ppl link 
```
same as original `npm link` (but some internal diffrences)


### Link package
```bash
ppl link <package>
```
internally adds the package name to `package-links.json` and calls `npm link <package>`


### Link all saved packages
```bash
ppl link-file
```
Links all packages stored in the `package-links.json` file.

## package-links.json
Linked packages are stored in this file to be linked after each call to `npm install`. This file can be put in .gitignore

## Known issues
- relinks packages for all dependencies, not very efficient but works

