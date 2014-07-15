var go = require('../globalObject'),
	config = require('../config'),
	crypto = require('crypto'),
	sha1 = require('sha1'),
	request = require('request');

var output = {};

output.genRandom = function () {
	return crypto.randomBytes(6).toString('hex');
};

output.genCode = function () {
	// if (go.code !== ""){
	// 	return go.code; // fixed code for now, TODO: #redirect
	// }
	var code = output.genRandom();
	go.code = code;
	return code;
};

output.genSignature = function (){
	var timestamp = +new Date + '';
	var nonce = output.genRandom();
	var echostr = output.genRandom();

	var arr = [go.serverToken, timestamp, nonce];
	arr.sort();
	var signature = sha1(arr.join(''));

	var sig = {
		timestamp: timestamp,
		nonce: nonce,
		echostr: echostr,
		signature: signature
	};
	return sig;
};

output.genAccessToken = function (req, res) {
	if (req.query.grant_type !== "client_credential" || req.query.appid !== config.appid || req.query.secret !== config.secret){
		res.send(403, "failed");
	}
	else{
		var access_token = output.genRandom();
		go.access_token = access_token;
		var data = {
			access_token: access_token,
			expires_in: 7200
		};
		res.send(200, data);
	}
};

module.exports = output;