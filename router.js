/**
 * @package     PlayJoomDaemon.Router
 * @subpackage  Main
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

module.exports = function(app) {
	app.get('/',require('./app/welcome/controller/').indexAction);
	app.get('/api/audiotrack',require('./app/api/controller/audiotrack.js').getAudiotrackItems);
	app.get('/api/albums',require('./app/api/controller/albums.js').getAlbums);
	app.post('/api/user/getToken',require('./app/api/controller/user.js').getToken);
	
	//setup API documentation
	const swaggerUi = require('swagger-ui-express');
	const swaggerDocument = require('./var/etc/swagger.json');
	
	var showExplorer = false;
	var options = {};
	var customCss = '#header { display: none }';
	var customFavicon = '/images/favicon.png'
	
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, showExplorer, options, customCss, customFavicon));
};

