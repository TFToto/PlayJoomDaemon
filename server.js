/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  Main
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var express = require('express');
var router = require('./router');

//Setup server config
var pjdconfig = require('pjd-config');
var config = new pjdconfig('./var/etc/server.conf');

var app = express();

app.use(express.static('public'));

router(app);

//Setup db connection
if(config.get('app.listen.port') === undefined) {
	config.set('app.listen.port', 8091);
}

app.listen(config.get('app.listen.port'), function (err) {
	
	if(err) {
		console.log(err);
	} else {
		console.log('PlayJoomDaemon runs at port:',config.get('app.listen.port'));
	}
});