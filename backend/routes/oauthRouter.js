var express = require("express"),
	logger = require('morgan'),
	go = require('../globalObject'),
	config = require('../config'),
	access = require('../util/access'),
	formatter = require('../util/formatter'),
	request = require('request'),
	querystring = require('querystring');

var router = express.Router({});

router.get("/access_token", function (req, res) {
	var code = req.query.code;
	var oauth_access_token = go.oauth_access_token;
	if (oauth_access_token === "")
		oauth_access_token = access.genRandom();
	if (code === go.code){
		var data = {
			access_token: oauth_access_token,
			expires_in: 7200,
			refresh_token: oauth_access_token,
			openid: config.userOpenid
		};
		res.send(200, data);
	}
	else{
		res.send(417, "invalid code");
	}
});

router.get("/authorize", function (req, res) {
	if (req.query.appid !== config.appid){
		res.send(417, "invalid appid");
	}
	console.log(req.originalUrl);
	var url = formatter.deformatUrl(req.originalUrl);
	res.redirect(url);
});

module.exports = router;