# Persistent package linker (ppl)

In `npm@>=5` packages linked via `npm link` are lost if `npm install` is called, this package tries to fix that. 

**NOTE:** currently only works with `npm@>=5.0.4` because of a bug in newer npm versions.

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
