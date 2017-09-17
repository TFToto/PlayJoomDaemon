/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link https://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var fs = require('fs');
var moment = require('moment');
var uaparser = require('ua-parser-js');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
var sharp = require('sharp');
var imgsize = require('image-size');

var pjdconfig = require('pjd-config');
var config = new pjdconfig('./var/etc/server.conf');

const db = low('./var/log/accessdb_' + moment().format('YYYY-MM') + '.json', {
	  storage: fileAsync
});

var log4js = require('log4js');
log4js.configure('./var/etc/log.conf.json');
var log = log4js.getLogger("ControllerCover");

//Init access db
db.defaults({ cover: [] }).write();

function getCoverGallery(req,res) {
	
	var ModelCover = require('../models/cover');
	var ViewCover = require('../views/cover');
	var HelperCover = require('../helper/cover');
	var HelperUser = require('../helper/user');

	var checkAuth = HelperUser.checkAuthorization(req);
	
	if(checkAuth != null && checkAuth != undefined) {
		
		var response_content = null;
		
		//Check for valid request parameters
		if(!response_content) {
			response_content = HelperCover.checkUrlParams(req);
		}
		
		if(!response_content) {

			ModelCover.fetchOne(req).then(function success(row) {
	
				if(row.data == null) {

					var json_res = JSON.stringify({
						response:"Cover data not available"
					});

					var response_content = {
						'message': json_res,
						'type':'json',
						'code':404
					}

					//Output the result of the request
					ViewCover.output(res, checkAuth.token, response_content);
				} else {
					
					var range = req.headers.range;
					var readStream;
					
//					res.header({
//			            'Content-Type': row.mime,
//			        });
					
					sharp(row.data)
						.resize(config.get('cover.gallery_width_size'))
						.embed()
						.sharpen()
						.toFormat(sharp.format.webp)
						.toBuffer(function(err, outputBuffer) {
					
							
							if (err) {
								throw err;
							}
							
							var new_img_dimensions = imgsize(outputBuffer);
							var json_res = JSON.stringify({
								mime: row.mime,
								width: new_img_dimensions.width,
								height: new_img_dimensions.height,
								imagedata: Buffer.from(outputBuffer).toString('base64')
							});
							
							var response_content = {
								'message': json_res,
								'type':'json',
								'code':200
							}
							
							//Output the result of the request
							ViewCover.output(res, checkAuth.token, response_content);

//							res.send(
//								Buffer.from(outputBuffer).toString('base64')
//							);
					});
				}
	
			}, function failure(err) {
				log.error(err);
				res.send(err);
			})
		} else {
			//Output the result of the request
			ViewCover.output(res, null, response_content);
		}
		
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
    	ViewCover.output(res, null, response_content);
	}	
}

function getCoverSingle(req,res) {
	
	var ModelAlbums = require('../models/cover');
	var ViewAlbums = require('../views/cover');
	var HelperUser = require('../helper/user');

	var checkAuth = HelperUser.checkAuthorization(req);
	
	if(checkAuth != null && checkAuth != undefined) {

		ModelCover.fetchOne(req, checkAuth.id).then(function success(row) {

	    	var response_content = {
				'message': JSON.stringify(row),
				'type':'json',
				'code':200
			}
	    	
	    	//Output the result of the request
			ViewCover.output(res, checkAuth.token, response_content);

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
    	ViewCover.output(res, null, response_content);
	}	
}

module.exports = {
	getCoverGallery: getCoverGallery,
	getCoverSingle: getCoverSingle
};