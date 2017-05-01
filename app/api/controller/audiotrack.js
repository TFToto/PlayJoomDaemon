/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var ModelAudiotrack = require('../models/audiotrack');
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
db.defaults({ audiotracks: [] }).write();

function getAudiotrackItems(req,res) {

	ModelAudiotrack.fetchTrack(req).then(function success(row) {

		var file = row[0].pathatlocal + '/' + row[0].file;
		fs.access(file, fs.R_OK, function (err) {
			if(!err) {
				
				var ua = uaparser(req.headers['user-agent']);
				console.log('Access to',file);

				//write access log
				db.get('audiotracks').push([{
					access_datetime: moment.utc().format(),
					trackid: row[0].id,
					file: file,
					client_ip: req.connection.remoteAddress,
					client: uaparser(req.headers['user-agent'])
				}]).last().write();

				var stat = fs.statSync(file);
				var range = req.headers.range;
				var readStream;
				
				if (range !== undefined) {

					var parts = range.replace(/bytes=/, "").split("-");

					var partial_start = parts[0];
					var partial_end = parts[1];

			        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
			            return res.sendStatus(500);
			        }

			        var start = parseInt(partial_start, 10);
			        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
			        var content_length = (end - start) + 1;

			        res.status(206).header({
			            'Content-Type': 'audio/mpeg',
			            'Content-Length': content_length,
			            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
			        });

			        readStream = fs.createReadStream(file, {start: start, end: end});
			    } else {
			        res.header({
			            'Content-Type': 'audio/mpeg',
			            'Content-Length': stat.size
			        });
			        readStream = fs.createReadStream(file);
			    }
				
				readStream.pipe(res);

			} else {
				log.error('File', file, 'not readable.');
				console.log('File', file, 'not readable.');
				//res.send('[{response:"File is not readable"}]');
				var json_res = JSON.stringify({
					response:"File is not readable"
				});
				res.setHeader('Content-Type', 'application/json');
				res.send(json_res);
			}
		});
	}, function failure(err) {
		log.error(err);
		res.send(err);
	})
}

module.exports = {
	getAudiotrackItems: getAudiotrackItems
};