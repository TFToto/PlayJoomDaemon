/**
 * @package     PlayJoomDaemon.Helpers
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
var 
	pjdconfig   = require('pjd-config'),
	config      = new pjdconfig('./var/etc/server.conf'),
	HelperUtils = require('../helper/utils'),
	log         = HelperUtils.logger('HelperCover');

function checkUrlParams(req){

	if(!req.query.coverid) {

		console.log('Error: Missing cover id parameter');

		var json_res = JSON.stringify({
				response:"Error: Missing cover id parameter"
			});
		var response_content = {
				'message':json_res,
				'type':'json',
				'code':400
			}

		return response_content;

	} else {
		
		if(req.query.coverid == '') {

			console.log('Error: Missing cover id content in parameters');

			var json_res = JSON.stringify({
					response:"Missing cover id content in parameters"
				});
			var response_content = {
					'message':json_res,
					'type':'json',
					'code':401
				}

			return response_content;

		} else {

			return null;
		}
	}
}

module.exports = {
	checkUrlParams: checkUrlParams
};

