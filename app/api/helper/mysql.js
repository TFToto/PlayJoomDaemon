/**
 * @package     PlayJoomDaemon.Helper
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf');

/**
 * Method for to get a MySQL db connection
 * 
 * @returns obj MySQL db object
 */
function getDBConnection() {
	
	var mysql = require('mysql');
	
	connection = mysql.createConnection({
		host: config.get('db.host'),
		user: config.get('db.user'),
		port: config.get('db.port'),
		database: config.get('db.database'),
		password: config.get('db.password')
	});
	
	return connection;
	
}
module.exports = {
	getDBConnection: getDBConnection
};

