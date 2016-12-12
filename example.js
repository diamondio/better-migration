var migration = require('./');

migration.version('0.3.1', function (cb) {
  console.log('Migrating to 0.3.1');
  cb();
})

migration.version('1.0.0', function (cb) {
  console.log('Migrating to 1.0.0');
  cb();
})

migration.version('1.0.1', function (cb) {
  console.log('Migrating to 1.0.1');
  cb();
})

migration.version('1.0.2', function (cb) {
  console.log('Migrating to 1.0.2');
  cb();
})


migration.start(function (err) {
  console.log('started!', err);
})
