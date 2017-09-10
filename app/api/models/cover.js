/**
 * @package     PlayJoomDaemon.Models
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link https://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var pjdconfig = require('pjd-config'),
	config = new pjdconfig('./var/etc/server.conf')
	util = require('util');
	HelperUtils = require('../helper/utils'),
	log         = HelperUtils.logger('HelperUser');

var HelperMysql     = require('../helper/mysql');
//var dbConnection = HelperMysql.getDBConnection();
var ModelUser       = require('../models/user');

function fetchOne(request) {
	
	var url_params = request.query;
	var dbConnection = HelperMysql.getDBConnection();
	var url_params = request.query,
		request_method = request.method;
	
	return new Promise(function (resolve, reject) {
		
		dbConnection.connect();
		var cover_id = dbConnection.escape(parseInt(url_params.coverid));
		var album_name = Buffer.from(dbConnection.escape(parseInt(url_params.album)), 'base64').toString('ascii');
		var artist_name = Buffer.from(dbConnection.escape(parseInt(url_params.album)), 'base64').toString('ascii');
		
		if(cover_id != '' || cover_id != 0) {
			//var no_cover_id = true;
			db_query = util.format('SELECT cb.data, cb.mime, cb.width, cb.height FROM #__coverblobs as cb WHERE cb.id = %s',cover_id);
		} else {
			
			var is_sampler = HelperUtils.checkForSampler(album_name,artist_name);
			
			if(album_name != '' && is_sampler) {
				db_query = util.format('SELECT cb.id, cb.data, cb.mime, cb.width, cb.height FROM #__coverblobs as cb WHERE cb.album = %s;',album_name);
				db_query += util.format('UPDATE #__audiotracks SET coverid = %s WHERE album = %s;', cover_id, album_name);
			} else {
				db_query = util.format('SELECT cb.id, cb.data, cb.mime, cb.width, cb.height FROM #__coverblobs as cb WHERE cb.album = %s AND cb.artist = %s;',album_name,artist_name);
				db_query += util.format('UPDATE #__audiotracks SET coverid = %s WHERE album = %s AND artist = %s', cover_id, album_name, artist_name);
			}
		}
		
		if(parseInt(url_params.coverid) >= 1) {
			//Placeholder for the table prefix is #__
			dbConnection.query(db_query.replace(/#__/g,config.get('db.tableprefix')), function(err, row, fields) {

				if (err) {
					console.log('query error:',err);
					log.error('query error:',err);
					reject(err);
				} else {
					if (row.length == 0) {
						console.log('Cover id does not exists.');
						log.error('Cover id does not exists.');
						resolve({
							data:null
						});
					} else {
						
//						if(no_cover_id) {
//							CoverIDSubsequentlyMaintain(album_name,artist_name, is_sampler, row.id);
//						}
						
						resolve({
							data:row[0].data,
							mime:row[0].mime,
							width:row[0].width,
							height:row[0].height
						});
					}
				}
			});
		} else {
			resolve(null);
		}
		
		dbConnection.end();
	});
}

/**
 * Method for to subsequently maintain the missing cover checksum integer
 *
 * @param array $item album items like artist and album name
 * @param boolean is_sampler
 *
 * @return boolean
 */
/*function CoverIDSubsequentlyMaintain(album_name, artist_name, is_sampler, cover_id) {

	return new Promise(function (resolve, reject) {
		
		//dbConnection.connect();
		
		if(is_sampler) {
			db_query = util.format('UPDATE #__audiotracks SET coverid = %s WHERE album = %s', cover_id, album_name);
		} else {
			db_query = util.format('UPDATE #__audiotracks SET coverid = %s WHERE album = %s AND artist = %s', cover_id, album_name, artist_name);
		}
		
		dbConnection.query(db_query.replace(/#__/g,config.get('db.tableprefix')), function(err, row, fields) {

			if (err) {
				console.log('query error:',err);
				log.error('query error:',err);
				reject(err);
			} else {
				console.log('Cover id does not exists.');
				log.error('Cover id does not exists.');
				resolve(true);
			}
		});
		
		//dbConnection.end();
	});
}*/

module.exports = {
	fetchOne: fetchOne
};

