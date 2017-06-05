/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var util = require('util'),
	pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf'),
	HelperUtils = require('../helper/utils'),
	log = HelperUtils.logger('ModelUser');

var HelperLmdb = require('../helper/lmdb');

function fetchUser(request) {
	
	var HelperMysql = require('../helper/mysql');
	
	var	request_user = request.body.username;
		request_pass = request.body.password;
		
	var dbConnection = HelperMysql.getDBConnection();
	
	return new Promise(function (resolve, reject) {
		
		dbConnection.connect();
		
		console.log('POST request for user', request_user);
		db_query = util.format(
			'SELECT * FROM `gtq2l_users` where `username` = %s AND `block` != 1', connection.escape(request_user));
		
		dbConnection.query(db_query, function(err, rows, fields) {

			if (rows.length != 1) {
				reject('User does not exists.');
			}
			
			if (err) {
				console.log('db errors:',err);
				reject(err);
			} else {
				resolve(rows);
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
	
	var moment = require('moment');
	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi = HelperLmdb.openLMDB(LMDBObj,'token');
	// Create transaction
	var txn = LMDBObj.beginTxn();
	var uuid = require('uuid').v4();
	
	var json_data = JSON.stringify({
		id: user_datas[0].id,
		username: user_datas[0].username,
		realname: user_datas[0].name,
		email: user_datas[0].email,
		expired: moment().add(config.get('user.expired_time'), config.get('user.expired_input'))
	});

	//Write the user datas into LMDB 
	txn.putString(dbi, uuid, json_data);
	txn.commit();
	
	return uuid;
}

function getExpired(token) {

	var LMDBObj = HelperLmdb.getLMDBConnection();
	var dbi = HelperLmdb.openLMDB(LMDBObj,'token');
	var txn = LMDBObj.beginTxn();	
	var value = JSON.parse(txn.getString(dbi, token));

	txn.commit();

	if (value) {
		return value.expired;
	} else {
		console.log('Missing expired date for token');
		log.warn('Missing expired date for token');
		return null;
	}
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

module.exports = {
	fetchUser: fetchUser,
	setUserToken: setUserToken,
	getExpired: getExpired,
	setUnsuccessfulAuth: setUnsuccessfulAuth,
	getUnsuccessfulAuth: getUnsuccessfulAuth
};

