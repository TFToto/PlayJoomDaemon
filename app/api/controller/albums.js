/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var fs = require('fs');
var moment = require('moment');
var uaparser = require('ua-parser-js');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

const db = low('./var/log/accessdb_' + moment().format('YYYY-MM') + '.json', {
	  storage: fileAsync
});

var log4js = require('log4js');
log4js.configure('./var/etc/log.conf.json');
var log = log4js.getLogger("startup");

//Init access db
db.defaults({ albums: [] }).write();

function getAlbums(req,res) {
	
	var ModelAlbums = require('../models/albums');
	//var ModelUser = require('../models/user');
	var ViewAlbums = require('../views/albums');
	var HelperUser = require('../helper/user');

	var checkAuth = HelperUser.checkAuthorization(req);
	
	if(checkAuth != null || checkAuth != undefined) {

		ModelAlbums.fetchItems(req, checkAuth.id).then(function success(rows) {

	    	var response_content = {
				'message': JSON.stringify(rows),
				'type':'json',
				'code':200
			}
	    	
	    	//Output the result of the request
			ViewAlbums.output(res, checkAuth.token, response_content);

		}, function failure(err) {
			log.error(err);
			res.send(err);
		})
		
	} else {

		var json_res = JSON.stringify({
			response:"Access denied! Invalid token."
		});
    	var response_content = {
			'message':json_res,
			'type':'json',
			'code':403
		}
    	
    	//Output the result of the request
    	ViewAlbums.output(res, response_content);
	}	
}

module.exports = {
	getAlbums: getAlbums
};