/**
 * @package     PlayJoomDaemon.Controller
 * @subpackage  Welcome
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
module.exports = {
		indexAction: indexAction
};

function indexAction (req, res) {
	var data = {
		title: 'PlayJoomDaemon',
		subtitle: 'The data daemon for PlayJoom',
		footertitle: 'Made by teglo',
		footertxt: 'Copyright © 2017 All Rights Reserved. PlayJoom is Free Software released under the GNU General Public License.'
	};
	res.render('index', data);
}
