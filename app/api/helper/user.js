/**
 * @package     PlayJoomDaemon.Helpers
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
	jwt         = require('jsonwebtoken');
	ModelUser   = require('../models/user');

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
	var passcheck = bcrypt.compareSync(req.body.password, row.password.replace('$2y$', '$2a$'));

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
	var moment = require('moment');
	
	// Decode token for request herader
	if(req.headers.authorization != '' && config.get('security.jwt_privatekey') != '') {

		try {
			var token_content = jwt.verify(req.headers.authorization, config.get('security.jwt_privatekey'));
			var txn = LMDBObj.beginTxn();
			var lmdb_values = JSON.parse(txn.getString(dbi, req.headers.authorization));
			txn.commit();
		} catch(err) {
			log.error('Error! checkAuthorization',err);
			console.log('Error! checkAuthorization',err);
			return null;
		}
	} else {
		return false;
	}

	if (lmdb_values) {

		//Write user data with new token as id into lmdb
		if(moment().format('X') < token_content.exp) {
			
			if(token_content.id == lmdb_values.id) {
				
				var new_token = ModelUser.setUserToken(lmdb_values);
				
				var txn = LMDBObj.beginTxn();
				var new_lmdb_values = JSON.parse(txn.getString(dbi, new_token));

//TODO just for development				txn.del(dbi,req.headers.authorization);
				txn.commit();
				
				return new_lmdb_values;
			} else {
				console.log('user id of lmdb does not matched with user id in requested token');
				log.warn('user id of lmdb does not matched with user id in requested token');
				
				return null;
			}
		} else {
			console.log('Token is exired');
			log.warn('Token is exired');
			
			return null;
		}
	} else {
		console.log('Invalid token');
		log.warn('Invalid token',req.headers.authorization);

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

