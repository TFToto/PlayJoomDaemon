/**
 * http://usejsdoc.org/
 */
/**
 * @package     PlayJoomDaemon.Helper
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var	pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf');
	HelperMysql = require('../helper/mysql');

function getFolderContent(path) {

	const fs = require('fs');

	fs.readdir(path, (err, files) => {
		
		console.log(files);
		
	  files.forEach(file => {
	    console.log(file);
	  });
	})
}

/**
 * Instanz of logger
 * 
 * @param string reference name of current method requrest
 * @returns obj log4js object
 */
function Logger(reference) {
	
	try {
		  require('fs').mkdirSync('./var/log');
	} catch (e) {
		  if (e.code != 'EEXIST') {
		    console.error("Could not set up log directory, error was: ", e);
		    process.exit(1);
		  }
	}
	var log4js = require('log4js');
	log4js.configure('./var/etc/log.conf.json');
	
	return log4js.getLogger(reference);
}
/**
 * Method for checking a track which is of a sampler album or not.
 *
 * @param string $album_name
 * @param string $artist_name
 * @return boolean
 */
function checkForSampler(album_name,artist_name) {
	
	var dbConnection = HelperMysql.getDBConnection();
	
	return new Promise(function (resolve, reject) {
		
		dbConnection.connect();
		
		if(album_name != '' || artist_name != 0) {
			db_query = util.format(
				'SELECT SUM(s.album = %s AND s.artist = %s ) AS counterBoth, SUM(s.album = %s) AS counterJustAlbum, cover_id',
				'FORM #__audiotracks AS s',
				album_name,
				artist_name,
				album_name
			)
		} else {
			console.log('Not possible to check for sampler without name of album and artist.');
			return false;
		}
		
		//Placeholder for the table prefix is #__
		dbConnection.query(db_query.replace(/#__/g,config.get('db.tableprefix')), function(err, row, fields) {

			if (err) {
				console.log('query error:',err);
				log.error('query error:',err);
				reject(false);
			} else {

				if (row.counterBoth != row.counterJustAlbum && row.counterBoth <= 1) {

					resolve(true);
				} else {
					resolve(false);
				}
					
			}
		});
		
		dbConnection.end();
	});
}

//Exports
module.exports = {
	getFolderContent: getFolderContent,
	logger: Logger,
	checkForSampler: checkForSampler
};