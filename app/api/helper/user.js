/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var 
	pjdconfig   = require('pjd-config'),
	config      = new pjdconfig('./var/etc/server.conf'),
	HelperUtils = require('../helper/utils'),
	log         = HelperUtils.logger('HelperUser');

function checkPass(pass_input, db_hash) {
	
	var bcrypt = require('bcrypt');

	var check = bcrypt.compareSync(pass_input, db_hash);

	if (check) {
		console.log('password is true');
		return true;
	} else {
		console.log('password is wrong');
		return false;
	}
	
}

function checkJSON(req) {
	
	var HelperJson = require('../helper/json');
	
	if(!HelperJson.IsValidJson(req.body)) {

		console.log('Error: JSON is not valid');

		var json_res = JSON.stringify({
				response:"Bad Request"
			});
		var response_content = {
				'message':json_res,
				'type':'json',
				'code':400
			}

		return response_content;

	} else {

		return null;
	}
}

function checkParams(req){

	if(!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) {

		console.log('Error: Wrong credential parameter');

		var json_res = JSON.stringify({
				response:"Authentication failed! Wrong parameter"
			});
		var response_content = {
				'message':json_res,
				'type':'json',
				'code':401
			}

		return response_content;

	} else {
		
		if(req.body.username == '' || req.body.password == '') {

			console.log('Error: Missing credential parameters');

			var json_res = JSON.stringify({
					response:"Authentication failed! Missing parameter"
				});
			var response_content = {
					'message':json_res,
					'type':'json',
					'code':401
				}

			return response_content;

		} else {

			return null;
		}
	}
}

/**
 * Method for to check if the password hash is vaild
 * @param obj req Request object
 * @param array user datas
 * @returns boolean
 */
function checkPassword(req,row) {
	
	var bcrypt = require('bcrypt');
	
	//identification hash for Joomla'$2y$'
	//identification hash for node.js '$2a$'
	var passcheck = bcrypt.compareSync(req.body.password, row[0].password.replace('$2y$', '$2a$'));

	if(passcheck) {
    	return true;
    	
    } else {
    	return false;
    }
}

function checkAuthorization(req) {
	
	var HelperLmdb = require('../helper/lmdb');
	
	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi = HelperLmdb.openLMDB(LMDBObj,'token');
	var txn = LMDBObj.beginTxn();
	
	var value = JSON.parse(txn.getString(dbi, req.headers.authorization));

	txn.commit();

	if (value) {
		return value;
	} else {
		console.log('Invalid token');
		log.warn('Invalid token');
		return null;
	}
}

module.exports = {
	checkPass: checkPass,
	checkParams: checkParams,
	checkJSON: checkJSON,
	checkPassword: checkPassword,
	checkAuthorization: checkAuthorization
};

