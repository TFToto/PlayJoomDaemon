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
module.exports = {
	getFolderContent: getFolderContent,
	logger: Logger
};