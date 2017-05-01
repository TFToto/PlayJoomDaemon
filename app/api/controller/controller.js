/**
 * http://usejsdoc.org/
 */

var ModelAudiotrack = require('../models/audiotrack');

function fetchAll(req,res) {
	ModelAudiotrack.fetchAll().then(function success(rows) {
		res.send(rows);
	}, function failure(err) {
		res.send(err);
	})
}

function getAudiotrack(req,res) {
	ModelAudiotrack.fetchAll().then(function success(row) {
		res.send(row);
	}, function failure(err) {
		res.send(err);
	})
}

module.exports = {
	fetchAll: fetchAll,
	getAudiotrackItems: getAudiotrackItems
};