var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

mkdirp.sync('./dbs');

require('./parseFn');

require('./create');
require('./count');
require('./find');
require('./update');
require('./primaryKey');

process.on('beforeExit', function(){
    rimraf.sync('./dbs');
});