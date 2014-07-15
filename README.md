#Wechat-Mocker

Wechat-Mocker是一个微信本地测试平台，用于在本地脱离微信测试平台和微信进行测试。

## How to use

1. 默认监听18181端口，把server向微信收发消息的地址改为 http://localhost:18181/
2. 若有proxy请清除
3. 根据自己的情况修改 /backend/config.json
4. 运行自己的server和Wechat-Mocker
5. 打开 [http://localhost:18181/sandbox/sandbox.html](http://localhost:18181/sandbox/sandbox.html) 进行接入，如要创建自定义菜单，建议此时同时操作
6. 打开 [http://localhost:18181/sandbox/index.html](http://localhost:18181/sandbox/index.html)，操作与微信类似

## Support

Feature request, pull request and bug report are welcomed.


## Server Part

### 基础内容

[接入指南](http://mp.weixin.qq.com/wiki/index.php?title=接入指南)

url:

	http://localhost:18181/weixin/access

method:
	
	POST

body:

	url: "http://localhost:18080/weixin"
	token: "anywhere"

[获取access token](http://mp.weixin.qq.com/wiki/index.php?title=获取access_token)

url:

	http://localhost:18181/weixin/token

method:

	GET

qs:

	grant_type: "client_credential"
	appid: config.appid
	secret: config.secret

### 自定义菜单

[自定义菜单创建接口](http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单创建接口)

url:

	http://localhost:18181/weixin/menu/create

method:

	POST

qs:

	access_token: go.access_token

body:

	menu(json)

[自定义菜单查询接口](http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单查询接口)

url:

	http://localhost:18181/weixin/menu/get

method:

	GET

qs:

	access_token: go.access_token


## User Part

### Click Menu

url:

	http://localhost:18181/user/menuClick

method:

	GET

qs:

	eventKey: eventKey

### Send Text

url:

	http://localhost:18181/user/text

method:

	GET

qs:

	content: content