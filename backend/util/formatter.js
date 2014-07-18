var config = require('../config'),
	parseString = require('xml2js').parseString,
	querystring = require('querystring'),
	urlMod = require('url'),
	access = require('./access');

var output = {};

output.formatText = function (content) {
	var timestamp = +new Date + "";
	var fmtText = [
		"<xml>",
		"<ToUserName><![CDATA[", config.serverOpenid, "]]></ToUserName>",
		"<FromUserName><![CDATA[", config.userOpenid, "]]></FromUserName>",
		"<CreateTime>", timestamp, "</CreateTime>",
		"<MsgType><![CDATA[text]]></MsgType>",
		"<Content><![CDATA[", content, "]]></Content>",
		"<MsgId>", timestamp, "</MsgId>",
		"</xml>"
	];
	return fmtText.join("");
};

output.formatMenuClick = function (eventKey) {
	var timestamp = +new Date + "";
	var fmtText = [
		"<xml>",
		"<ToUserName><![CDATA[", config.serverOpenid, "]]></ToUserName>",
		"<FromUserName><![CDATA[", config.userOpenid, "]]></FromUserName>",
		"<CreateTime>", timestamp, "</CreateTime>",
		"<MsgType><![CDATA[event]]></MsgType>",
		"<Event><![CDATA[CLICK]]></Event>",
		"<EventKey><![CDATA[", eventKey, "]]></EventKey>",
		"</xml>"
	];
	return fmtText.join("");
};

output.formatBasicEvent = function (eventName) {
	var timestamp = +new Date + "";
	var fmtText = [
		"<xml>",
		"<ToUserName><![CDATA[", config.serverOpenid, "]]></ToUserName>",
		"<FromUserName><![CDATA[", config.userOpenid, "]]></FromUserName>",
		"<CreateTime>", timestamp, "</CreateTime>",
		"<MsgType><![CDATA[event]]></MsgType>",
		"<Event><![CDATA[", eventName, "]]></Event>",
		"</xml>"
	];
	return fmtText.join("");
};

output.formatUrl = function (originalUrl) {
	var urlObj = {
		protocol: "http",
		hostname: "localhost",
		port: 18181,
		pathname: "/oauth/authorize",
		query: {
			appid: config.appid,
			redirect_uri: originalUrl,
			response_type: "code",
			scope: "snsapi_base",
			state: 1
		}
	};
	var url = urlMod.format(urlObj);
	return url;
};

output.deformatUrl = function (originalUrl) {
	// original url
	var url = querystring.parse(originalUrl).redirect_uri;
	console.log(url);
	url = querystring.unescape(url);
	// parse url
	var parsedUrl = urlMod.parse(url, true);
	// add code
	var code = access.genCode();
	if (parsedUrl.query){
		parsedUrl.query.code = code;
	}
	else{
		parsedUrl.query = {
			code: code
		};
	}
	url = urlMod.format(parsedUrl);
	return url;
};

output.deformatNews = function (msg, callback) {
	var items = msg.Articles[0].item;
	console.log(items);
	for (var i = 0; i < items.length; i++) {
		items[i].Title = items[i].Title[0];
		items[i].Description = items[i].Description[0];
		items[i].PicUrl = items[i].PicUrl[0];
		items[i].Url = items[i].Url[0];
		if (items[i].Url !== ""){
			items[i].Url = output.formatUrl(items[i].Url);
		}
	}
	var data = {
		items: items,
		msgType: "news"
	};
	callback(data);
};

output.deformatText = function (msg, callback) {
	var text = msg.Content;
	callback({
		msgType: "text",
		content: text
	});
};

var deformatHandler = {
	"news": output.deformatNews,
	"text": output.deformatText
};

output.deformatMsg = function (xml, callback) {
	parseString(xml, function (err, result) {
		var msgType = result.xml.MsgType[0];
		if (typeof deformatHandler[msgType] !== "undefined"){
			deformatHandler[msgType](result.xml, callback);
		}
	});
};

module.exports = output;