/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var 
	mysql = require('mysql'),
	pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf')
	util = require('util');


function fetchTrack(request) {
	
	var
		url_params = request.query,
		request_method = request.method;
	
	return new Promise(function (resolve, reject) {
		
		connection = mysql.createConnection({
			host: config.get('db.host'),
			user: config.get('db.user'),
			database: config.get('db.database'),
			password: config.get('db.password')
		});
		
		connection.connect();
		
		if(url_params.id) {
			switch (request_method) {
				case 'GET':
					db_query = util.format('SELECT * FROM `gtq2l_jpaudiotracks` where `id` = %s', connection.escape(url_params.id));
				break;
			}
		}
		
		connection.query(db_query, function(err, rows, fields) {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
		
		connection.end();
	});
}

module.exports = {
	fetchTrack: fetchTrack
};

