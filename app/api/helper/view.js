/**
 * @package     PlayJoomDaemon.Helper
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
function createHeaderType(type) {
	
	switch(type) {
	
		case 'aac':
			var res_type = {'Content-Type':'audio/aac'};
			break;
		case 'csv':
			var res_type = {'Content-Type':'text/csv'};
			break;
		case 'gif':
			var res_type = {'Content-Type':'image/gif'};
			break;
		case 'html':
		case 'htm':
			var res_type = {'Content-Type':'text/html'};
			break;
		case 'jpeg':
		case 'jpg':
			var res_type = {'Content-Type':'image/jpeg'};
			break;
		case 'json':
			var res_type = {'Content-Type':'application/json'};
			break;
		case 'mp3':
			var res_type = {'Content-Type':'audio/mpeg'};
			break;
		case 'mpeg':
			var res_type = {'Content-Type':'video/mpeg'};
			break;
		case 'oga':
			var res_type = {'Content-Type':'audio/ogg'};
			break;
		case 'ogv':
			var res_type = {'Content-Type':'video/ogg'};
			break;
		case 'xhtml':
			var res_type = {'Content-Type':'application/xhtml+xml'};
			break;
		case 'xml':
			var res_type = {'Content-Type':'application/xml'};
			break;
		case 'wav':
			var res_type = {'Content-Type':'audio/x-wav'};
			break;
		case 'weba':
			var res_type = {'Content-Type':'audio/webm'};
			break;
		default:
			var res_type = null;
			break;
	}
	
	return res_type;
}

module.exports = {
	createHeaderType: createHeaderType
};

