var fs         = require('fs');
var async      = require('async');
var semver     = require('semver');
var semverSort = require('semver-sort');
var lockfile   = require('lockfile');

var scripts = {};
var LOCK_FILE = './version.lock';
var VERSION_FILE = './version';

// Default get fn
exports.get = function (cb) {
  fs.readFile(VERSION_FILE, { encoding: 'utf8' }, function (err, version) {
    if (err && err.code === 'ENOENT') {
      return cb(null, '0.0.0');
    }
    if (err) return cb(err);
    cb(null, version);
  });
}

// Default set fn
exports.set = function (v, cb) {
  fs.writeFile(VERSION_FILE, v, { flags: 'w+', encoding: 'utf8' }, cb);
}

// Default lock fn
exports.lock = function (cb) {
  lockfile.lock(LOCK_FILE, function (err) {
    if (err) return cb(err);
    cb(null, function (cb) {
      lockfile.unlock(LOCK_FILE, cb);
    })
  })
}

exports.version = function (v, script) {
  scripts[v] = script;
}

exports.start = function (cb) {
  exports.lock(function (err, release) {
    if (err) {
      return release(function () {
        return cb({ message: 'failed_to_obtain_lock' });
      });
    }
    exports.get(function (err, version) {
      if (err) {
        return release(function () {
          return cb({ message: 'failed_to_get_current_version', details: err });
        });
      }

      var all = Object.keys(scripts);
      var versions = all.filter(function (v) { return semver.lt(version, v) });
      semverSort.asc(versions);

      var latest = version;
      async.eachSeries(versions, function (v, cb) {
        var fn = scripts[v];
        if (typeof fn !== 'function') {
          return cb({ message: 'script_is_not_a_function' });
        }
        fn(function (err) {
          if (err) return cb(err);
          latest = v;
          exports.set(v, cb);
        })
      }, function (err) {
        if (err) {
          return release(function () {
            return cb(err);
          });
        }
        return release(function () {
          cb(null, latest);
        });
      })
    })
  })
}
