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
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

const db = low('./accessdb.json', {
	  storage: fileAsync
});

const dateTime = require('date-time');
console.log(dateTime());

//Init access db
db.defaults({ audiotracks: [] }).write();

function getAudiotrackItems(req,res) {

	ModelAudiotrack.fetchTrack(req).then(function success(row) {

		var file = row[0].pathatlocal + '/' + row[0].file;
		fs.access(file, fs.R_OK, function (err) {
			if(!err) {
				
				console.log('Access to',file);
				//db.set('audiotracks',[{id: + row[0].id}]).write();
				db.get('audiotracks').push([{
					accessdate: + dateTime(),
					trackid: + row[0].id,
					file: + file
				}]).last().write();

				var stat = fs.statSync(file);
				var range = req.headers.range;
				var readStream;
				
				if (range !== undefined) {

					var parts = range.replace(/bytes=/, "").split("-");

					var partial_start = parts[0];
					var partial_end = parts[1];

			        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
			            return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
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
				
				
				//Frist version
				/*console.log('Access to',file);
				var stat = fs.statSync(file);

                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });*/

                //fs.createReadStream(file).pipe(res);
			} else {
				console.log('File', file, 'not readable.');
				//res.send('[{response:"File is not readable"}]');
				var json_res = JSON.stringify({
					response:"File is not readable"
				});
				res.setHeader('Content-Type', 'application/json');
				res.send(json_res);
			}
		});
		
		//res.send(row);
	}, function failure(err) {
		res.send(err);
	})
}

module.exports = {
	getAudiotrackItems: getAudiotrackItems
};