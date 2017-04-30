/**
 * @package     PlayJoomDaemon.Router
 * @subpackage  Main
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

module.exports = function(app) {
	//app.get('/api', require('./app/api/controller/controller.js').fetchAll);
	app.get('/api/audiotrack',require('./app/api/controller/audiotrack.js').getAudiotrackItems);
};

