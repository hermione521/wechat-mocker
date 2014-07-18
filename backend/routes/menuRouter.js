var express = require("express"),
	go = require('../globalObject'),
	fs = require('fs');

var router = express.Router({});

router.post('/create', function (req, res){
	var accessGot = req.query.access_token;
	var menu = req.body;
	console.dir(menu);

	if (go.access_token !== "" && go.access_token === accessGot){
		go.menu = menu;

		var file = fs.realpathSync('.') + "/app/src/menu.json";
		fs.writeFileSync(file, JSON.stringify(menu));
		
		console.log("new menu created");
		res.send(200, {"errcode":0,"errmsg":"ok"});
	}
	else{
		console.log("create menu err: invalid access_token");
		res.send(403, {"errcode":40018,"errmsg":"whatever error"});
	}
});

router.get('/get', function (req, res){
	var accessGot = req.query.access_token;

	if (go.access_token !== "" && go.access_token === accessGot){
		res.send(200, go.menu);
	}
	else{
		res.send(403, {"errcode":40018,"errmsg":"whatever error"});
	}
});

router.get('/delete', function (req, res){
	var accessGot = req.query.access_token;

	if (go.access_token !== "" && go.access_token === accessGot){
		go.menu = {};
		res.send(200, {"errcode":0,"errmsg":"ok"});
	}
	else{
		res.send(403, {"errcode":40018,"errmsg":"whatever error"});
	}
});

module.exports = router;