/**
 * @package     PlayJoomDaemon.Views
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */

var HelperView = require('../helper/view');

function output(res, content) {

	res.status(content.code);
	res.header(HelperView.createHeaderType(content.type));
	res.send(content.message);

}

module.exports = {
		output: output
};