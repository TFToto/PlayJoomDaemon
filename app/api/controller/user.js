/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var ModelUser = require('../models/user');
var ViewUser = require('../views/user');
var HelperUser = require('../helper/user');

//Import 3rd party components
var fs       = require('fs');
var moment   = require('moment');
var uaparser = require('ua-parser-js');

var pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf');

const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
const db = low('./var/log/accessdb_' + moment().format('YYYY-MM') + '.json', {
	  storage: fileAsync
});

//Init access db
db.defaults({ user: [] }).write();

function getToken(req,res) {

	var response_content = null;
	
	if(ModelUser.getUnsuccessfulAuth(req) > config.get('security.maxFailedAuths')) {
		var json_res = JSON.stringify({
			response:"Access denied!"
		});
    	var response_content = {
			'message':json_res,
			'type':'json',
			'code':403
		}
	}
	//Check for valid json string
	if(!response_content) {
		ModelUser.setUnsuccessfulAuth(req, ModelUser.getUnsuccessfulAuth(req) + 1);
		response_content = HelperUser.checkJSON(req);
	}
	
	//Check for credential content
	if(!response_content) {
		ModelUser.setUnsuccessfulAuth(req, ModelUser.getUnsuccessfulAuth(req) + 1);
		response_content = HelperUser.checkParams(req);
	}
	
	if(!response_content){
		
		console.log('check for user pass');
		
		ModelUser.fetchUser(req,res).then(function success(row) {

			var pass_check = HelperUser.checkPassword(req,row);
			
			if (pass_check) {
				
				if (ModelUser.getUnsuccessfulAuth(req) != 0) {
					ModelUser.setUnsuccessfulAuth(req, 0);
				}
				var token_str = ModelUser.setUserToken(row,req);
				
				var json_res = JSON.stringify({
					response: "Authentication successful",
					token: token_str
				});
		    	var response_content = {
					'message':json_res,
					'type':'json',
					'code':200
				}

			} else {
				
				ModelUser.setUnsuccessfulAuth(req, ModelUser.getUnsuccessfulAuth(req) + 1);

		    	var json_res = JSON.stringify({
					response:"Authentication failed! Wrong password"
				});
		    	var response_content = {
					'message':json_res,
					'type':'json',
					'code':401
				}
			}
			
			//Output the result of the request
			ViewUser.output(res, response_content);
			
		}, function failure(err) {
			
			ModelUser.setUnsuccessfulAuth(req, ModelUser.getUnsuccessfulAuth(req) + 1);

			if(err == 'User does not exists.') {
				
				var json_res = JSON.stringify({
					response:"Authentication failed! User does not exists."
				});
				var response_content = {
					'message':json_res,
					'type':'json',
					'code':403
				}

			} else {
				var json_res = JSON.stringify({
					response:"Internal Error"
				});
				var response_content = {
					'message':json_res,
					'type':'json',
					'code':500
				}
			}
			
			ViewUser.output(res, response_content);
		})

	} else {
		//Output the result of the request
		ViewUser.output(res, response_content);
	}
}

module.exports = {
		getToken: getToken
};