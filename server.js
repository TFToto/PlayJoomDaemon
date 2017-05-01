/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  Main
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var express = require('express');
var router  = require('./router');
var path    = require('path');

//Setup server config
var pjdconfig = require('pjd-config');
var config = new pjdconfig('./var/etc/server.conf');

var app = express();

app.use(express.static('public'));

router(app);

//Setup logger
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
var log = log4js.getLogger("startup");

//Setup view template engine
app.set('views', './templates');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//Setup db connection
if(config.get('app.listen.port') === undefined) {
	config.set('app.listen.port', 8091);
}

app.listen(config.get('app.listen.port'), function (err) {
	
	if(err) {
		console.log(err);
	} else {
		console.log('PlayJoomDaemon runs at port:',config.get('app.listen.port'));
		log.info('PlayJoomDaemon runs at port:',config.get('app.listen.port'));
		log.info('Process id is ',process.pid);
	}
});