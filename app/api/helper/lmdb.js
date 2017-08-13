/**
 * @package     PlayJoomDaemon.Helper
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf'),
	HelperUtils = require('../helper/utils'),
	log = HelperUtils.logger('HelperLmdb');

/**
 * Method for to create a database connection
 * 
 * @returns obj LMDB object
 */
function getLMDBConnection() {
	
	var lmdb = require('node-lmdb'),
		fs = require('fs'),
		env = new lmdb.Env(),
		db_path = config.get('lmdb.path');
	
	if (!fs.existsSync(db_path)){
		log.warn('Folder',db_path,'for lmdb does nor exists. Create folder');
		try {
			fs.mkdirSync(db_path);
		} catch(err) {
			log.error('Folder',db_path,'for lmdb cannot be created');
		}
	}
	
	env.open({
	    // Path to the environment
	    path: db_path,
	    // Maximum number of databases
	    maxDbs: config.get('lmdb.maxdbs')
	});
	
	return env;
	
}
/**
 * Method for to create an d get a db table
 * 
 * @param Obj LMDB connection object
 * @param string Name of tablename
 * @returns opend table object
 */
function openLMDB(LMDBObj,tablename) {

	var dbi = LMDBObj.openDbi({
		   name: tablename,
		   keyIsString: true,
		   create: true
		});
	return dbi;
}

module.exports = {
	getLMDBConnection: getLMDBConnection,
	openLMDB: openLMDB
};