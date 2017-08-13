/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf')
	util = require('util');

var HelperMysql     = require('../helper/mysql');
var HelperComparams = require('../helper/comparams');
var ModelUser       = require('../models/user');

function fetchItems(request,user_id) {
	
	var dbConnection = HelperMysql.getDBConnection();
	var url_params = request.query,
		request_method = request.method;
	
	return new Promise(function (resolve, reject) {
		
		dbConnection.connect();
		
		db_query = util.format(
			'SELECT a.artist, a.album, a.year, a.catid, a.access, a.pathatlocal, c.title AS category_title, cb.id AS coverid, cb.mime',
			'FROM `#__audiotracks` a',
			'LEFT JOIN `#__categories` c',
			'ON c.id = a.catid',
			'LEFT JOIN `#__coverblobs` cb',
			'ON cb.id = a.coverid',
			'GROUP BY a.album, a.pathatlocal, a.artist, a.year, a.catid, a.access, c.title, cb.id, cb.mime',
			'LIMIT 3'
		);

		//Placeholder for the table prefix is #__
		dbConnection.query(db_query.replace(/#__/g,config.get('db.tableprefix')), function(err, rows, fields) {
			if (err) {
				console.log('query error:',err);
				reject(err);
			} else {
				resolve(rows);
			}
		});
		
		dbConnection.end();
	});
}

module.exports = {
	fetchItems: fetchItems
};

