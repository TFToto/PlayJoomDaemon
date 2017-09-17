/**
 * @package     PlayJoomDaemon.Views
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var HelperView = require('../helper/view');

function output(res, token, content) {

	res.status(content.code);
	res.header(HelperView.createHeaderType(content.type));
	res.header({'Access-Control-Expose-Headers':'Authorization'});
	res.header({'Authorization':token});
	res.send(content.message);

}

module.exports = {
		output: output
};