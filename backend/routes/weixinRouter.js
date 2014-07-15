var express = require("express"),
	go = require('../globalObject'),
	access = require('../util/access'),
	menuRouter = require('./menuRouter'),
	request = require('request');

var router = express.Router({});

router.use('/menu', menuRouter);

router.get('/serverInfo', function (req, res) {
	res.send(200, {
		url: go.serverUrl,
		token: go.serverToken
	});
});

router.post('/access', function (req, res) {
	console.log(req.body);
	go.serverToken = req.body.token;

	var sig = access.genSignature();

	var option = {
		url: req.body.url,
		method: "GET",
		qs: sig
	};
	request(option, function (err, serverRes, body) {
		if (err){
			console.log("request for echostr err: " + err);
		}
		else{
			if (body === sig.echostr){
				go.serverUrl = req.body.url;
				res.send(200, "success");
			}
			else{
				res.send(403, "failed");
			}
		}
	});
});

router.get('/token', function (req, res) {
	access.genAccessToken(req, res);
});

module.exports = router;