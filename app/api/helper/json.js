/**
 * @package     PlayJoomDaemon.Helper
 * @subpackage  API
 *
 * @copyright Copyright (C) 2017 by teglo. All rights reserved.
 * @link http://www.playjoom.org
 * @license http://www.playjoom.org/en/about/licenses/gnu-general-public-license.html
 */
function IsValidJson(item) {
    
	item = typeof item !== "string"
	        ? JSON.stringify(item)
	        : item;

	    try {
	        item = JSON.parse(item);
	    } catch (e) {
	    	console.log('JSON not valid!',e)
	        return false;
	    }

	    if (typeof item === "object" && item !== null) {
	        return true;
	    }

	    return false;
}
module.exports = {
	IsValidJson: IsValidJson
};

