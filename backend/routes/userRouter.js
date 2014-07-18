var express = require("express"),
	logger = require('morgan'),
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
			console.log("no response for text");
			res.send(204);
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
			console.log("no response for menuClick");
			res.send(204);
		}
		else{
			formatter.deformatMsg(serverBody, function (fmtData) {
				console.dir(fmtData);
				res.send(200, fmtData);
			});
		}
	});
});

router.get('/subscribe', function (req, res) {
	if (!go.configured){
		res.send(409, "status: not configured");
	}
	if (!go.subscribed){
		go.subscribed = true;
		var content = formatter.formatBasicEvent("subscribe");
		var option = {
			url: go.serverUrl,
			method: "POST",
			body: content,
			qs: access.genSignature()
		};
		request(option, function (err, serverRes, serverBody) {
			if (err){
				console.log("no response for subscribe");
				res.send(204);
			}
			else{
				formatter.deformatMsg(serverBody, function (fmtData) {
					console.dir(fmtData);
					res.send(200, fmtData);
				});
			}
		});
	}
	else{
		res.send(409, "status: subscribed");
	}
});

router.get('/unsubscribe', function (req, res) {
	if (!go.configured){
		res.send(409, "status: not configured");
	}
	if (go.subscribed){
		go.subscribed = false;
		var content = formatter.formatBasicEvent("unsubscribe");
		var option = {
			url: go.serverUrl,
			method: "POST",
			body: content,
			qs: access.genSignature()
		};
		request(option, function (err, serverRes, serverBody) {
			// should be no response for unsubscribe
		});
		res.send(204);
	}
	else{
		res.send(409, "status: unsubscribed");
	}
});

module.exports = router;