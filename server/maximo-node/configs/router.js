var path = require('path');
var glob = require('glob');

var routers = [];

var routerPath = path.join(__dirname, '../routers').replace(/\\/g, '/');

var files = glob.sync('**/*.js', {cwd: routerPath});

files.forEach(function(file) {
    routers.push(`require('${routerPath}/${file}')`);
 });


module.exports = '['+routers.join(', ')+']';