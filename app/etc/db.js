/**
 * http://usejsdoc.org/
 */
//Setup server config
var pjdconfig = require('pjd-config');
var config = new pjdconfig('./var/etc/server.conf');

//Setup db connection
if(config.get('db.host') === undefined) {
	config.set('db.host', '127.0.0.1');
}
if(config.get('db.port') === undefined) {
	config.set('db.port', 3306);
}
if(config.get('db.user') === undefined) {
	config.set('db.user', 'root');
}
if(config.get('db.password') === undefined) {
	config.set('db.password', 'password');
}
if(config.get('db.database') === undefined) {
	config.set('db.database', 'playjoom');
}
if(config.get('db.tableprefix') === undefined) {
	config.set('db.tableprefix', 'xxxx_');
}

//exports.connection = connection;