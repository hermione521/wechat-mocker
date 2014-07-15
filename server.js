var app = require("express")(),
	serveStatic = require('serve-static'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	go = require('./backend/globalObject'),
	weixinRouter = require('./backend/routes/weixinRouter'),
	userRouter = require('./backend/routes/userRouter'),
	oauthRouter = require('./backend/routes/oauthRouter');

app.use(bodyParser());
app.use(cookieParser());
app.use('/sandbox', serveStatic('app/src'));

app.use('/*', function(req, res, next) {
	console.log('echo %s: %s', req.method, req.originalUrl);
	next && next();
});

app.use('/weixin', weixinRouter);
app.use('/user', userRouter);
app.use('/oauth', oauthRouter);

app.listen(18181);
