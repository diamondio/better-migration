Better Migration - Make migrations easy!
---------------------

[![npm package](https://nodei.co/npm/better-migration.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-migration/)
[![Build status](https://img.shields.io/travis/diamondio/better-migration.svg?style=flat-square)](https://travis-ci.org/diamondio/better-migration)
[![Dependency Status](https://img.shields.io/david/diamondio/better-migration.svg?style=flat-square)](https://david-dm.org/diamondio/better-migration)
[![Known Vulnerabilities](https://snyk.io/test/npm/better-migration/badge.svg?style=flat-square)](https://snyk.io/test/npm/better-migration)
[![Gitter](https://img.shields.io/badge/gitter-join_chat-blue.svg?style=flat-square)](https://gitter.im/diamondio/better-migration?utm_source=badge)

This is a simple tool to migrate data. It features some key features:

 - Easy to write migrations: just implement the function
 - Out of the box auto-save current version (into a simple text file)
 - Out of the box locking mechanism to ensure only one migration is running
 - Customizable version saving and locking mechanism


```bash
npm install --save better-migration
```

## Usage

```js
var migration = require('better-migration');
```

The idea behind this tool is simple:

#### 1. Write a migration script
```js
migration.version('1.0.0', function (cb) {
	// Your migration script, call cb() when done.
	// cb(err) will abort the migration.
	cb();
})
```

#### 2. Start the migration

This will run your migration scripts one at a time until it reaches the latest version.

```js
migration.start(function (err) {
	// If the error is set, the script failed, and you should probably not continue.
	// Your data is updated to the latest semver version (in this case is 1.0.0)
})
```

When you need to migrate again, just call migration.set with the new version number, and restart.


## Advanced usage

By default, we save the current version into a file, `./version`. You may change this:

```js
var migration = require('better-migration');
```

Optionally, you may set your own functions for setting the version/lock:

```js
// Set the function to get the version
migration.get = function (cb) {
	cb(null, '1.0.0');
};

// Set the function to set the version
migration.set = function (v, cb) {
	cb(); // Call when saved
}

// Set the function to obtain a lock for migration.
migration.lock = function (cb) {
	// After you acquire the lock, you must return a release function
	// so that we can release the lock after the migration is complete.
	cb(err, release)
}
```


Contributions welcome!

### Credits
This library was initially made by the awesome team of engineers at [Diamond](https://diamond.io).

If you haven't already, make sure you install Diamond!
