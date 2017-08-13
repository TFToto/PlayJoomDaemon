/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var HelperMysql = require('../helper/mysql'),
	HelperLmdb  = require('../helper/lmdb'),
	HelperUtils = require('../helper/utils');

var util = require('util'),
	pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf'),
	log = HelperUtils.logger('ModelUser');

function fetchUser(request) {
	
	var	request_user = request.body.username;
		request_pass = request.body.password;
	
	return new Promise(function (resolve, reject) {
		
		var dbConnection = HelperMysql.getDBConnection();		
		dbConnection.connect();
		
		console.log('POST request for user', request_user);
		db_query = util.format(
			'SELECT * FROM `#__users` where `username` = %s AND `block` != 1', connection.escape(request_user));
		
		dbConnection.query(db_query.replace(/#__/g,config.get('db.tableprefix')), function(err, rows, fields) {

			if (rows.length != 1) {
				reject('User does not exists.');
			}
			
			if (err) {
				console.log('db errors:',err);
				reject(err);
			} else {
				resolve({
					id:rows[0].id,
					username:rows[0].username,
					password:rows[0].password,
					name:rows[0].name,
					email:rows[0].email
				});
			}
		});
		
		dbConnection.end();
	});
}

/**
 * Method for to set user datas into lmdb 
 * 
 * @param obj user_datas 
 * @returns string uuid as user token
 */
function setUserToken(user_datas) {
	
	//var moment  = require('moment');
	var jwt     = require('jsonwebtoken');
	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi     = HelperLmdb.openLMDB(LMDBObj,'token');

	// Create transaction
	var txn = LMDBObj.beginTxn();
	//var uuid = require('uuid').v4();
	
	var token = jwt.sign({
		  id: user_datas.id
		}, config.get('security.jwt_privatekey'),{ expiresIn: '24h' });
	
	var json_data = JSON.stringify({
		id: user_datas.id,
		username: user_datas.username,
		realname: user_datas.name,
		email: user_datas.email,
		token: token
		//expired: moment().add(config.get('user.expired_time'), config.get('user.expired_input'))
	});

	//Write the user datas into LMDB
	txn.putString(dbi, token, json_data);
	txn.commit();
	
	return token;
}

function setUnsuccessfulAuth(req, value) {
	
	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi = HelperLmdb.openLMDB(LMDBObj,'auth');
	var txn = LMDBObj.beginTxn();
	
	txn.putNumber(dbi, req.connection.remoteAddress, value);
	txn.commit();
	
}

function getUnsuccessfulAuth(req) {
	
	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi = HelperLmdb.openLMDB(LMDBObj,'auth');
	var txn = LMDBObj.beginTxn();
	
	var unsuccess = txn.getNumber(dbi, req.connection.remoteAddress);
	txn.commit();	
	
	return unsuccess;
	
}

function getGroupsByUser(user_id) {
	
	return new Promise(function (resolve, reject) {

		var dbConnection = HelperMysql.getDBConnection();

			dbConnection.connect();

			db_query = util.format(
				'SELECT b.id FROM #__user_usergroup_map map',
				'LEFT JOIN #__usergroups a ON',
				'a.id = map.group_id',
				'LEFT JOIN #__usergroups AS b ON', 
				'b.lft <= a.lft AND b.rgt >= a.rgt',
				'where map.user_id = ' + user_id
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
	fetchUser: fetchUser,
	setUserToken: setUserToken,
	setUnsuccessfulAuth: setUnsuccessfulAuth,
	getUnsuccessfulAuth: getUnsuccessfulAuth,
	getGroupsByUser:getGroupsByUser
};

