var express = require("express"),
	go = require('../globalObject'),
	access = require('../util/access'),
	formatter = require('../util/formatter'),
	request = require('request');

var router = express.Router({});

router.get('/text', function (req, res) {
	var content = formatter.formatText(req.query.content);
	console.log(content);
	var option = {
		url: go.serverUrl,
		method: "POST",
		body: content,
		qs: access.genSignature()
	};
	request(option, function (err, serverRes, serverBody) {
		if (err){
			console.log("request for text err: " + err);
			res.send(417, err);
		}
		else{
			formatter.deformatMsg(serverBody, function (fmtData) {
				console.dir(fmtData);
				res.send(200, fmtData);
			});
		}
	});
});

router.get('/menuClick', function (req, res) {
	var content = formatter.formatMenuClick(req.query.eventKey);
	var option = {
		url: go.serverUrl,
		method: "POST",
		body: content,
		qs: access.genSignature()
	};
	request(option, function (err, serverRes, serverBody) {
		if (err){
			console.log("request for text err: " + err);
			res.send(417, err);
		}
		else{
			formatter.deformatMsg(serverBody, function (fmtData) {
				console.dir(fmtData);
				res.send(200, fmtData);
			});
		}
	});
});

module.exports = router;