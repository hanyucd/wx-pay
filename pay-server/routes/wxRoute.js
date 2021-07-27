const express = require('express');
const router = express.Router();

const cache = require('memory-cache');
const wxConfig = require('../config').wx;
const wxh5Util = require('../utils/wxh5Util');
// let request = require('request');

/**
 * 用户授权重定向
 */
router.get('/redirect', function (req, res) {
	let redirectUrl = req.query.url; // 最终重定向的地址 -> 跳转回前端的页面
	let scope = req.query.scope; // 网页应用授权作用域
	cache.put('redirectUrl', redirectUrl); // 通过 cache 缓存重定向地址
	
	// const redirect_uri = 'http://127.0.0.1:8080/api/wechat/getOpenId'; // 授权回调地址，用来获取 code
	const redirect_uri = 'http://192.168.5.72:8080/api/wechat/getOpenId'; // 授权回调地址，用来获取 code
	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ wxConfig.appId }&redirect_uri=${ redirect_uri }&response_type=code&scope=${ scope }&state=STATE#wechat_redirect`;
	res.redirect(authorizeUrl); // 重定向到微信授权页面
});

/**
 * 根据 code 获取用户的 openid
 */
router.get('/getOpenId', async function (req, res) {
	const code = req.query.code;
	console.log('code码:', code);

	if (!code) return res.send({ code: 1001, data: null, mess: '未获取到 code' });
	
	console.log('响应开始');
	// 根据 code 获取授权 access_tokenqou
	const resResult = await wxh5Util.getAuthAccessToken(code);

	console.log('响应结果：', resResult);
	
	console.log('响应结束');
	
	// 发起 http 请求
	// request.get(token_url, (error, response, body) => {
	// 	console.log('内容：', body)
	// 	if (!error && response.statusCode === 200) {
	// 		const data = JSON.parse(body);
	// 		console.log(data);

	// 		const expire_time = 1000 * 60; // 过期时间 1 分钟
	// 		res.cookie('openId', data.openid, { maxAge: expire_time });
	// 		const redirectUrl = cache.get('redirectUrl');

	// 		console.log('缓存：', redirectUrl);

	// 		res.redirect(redirectUrl); // 重定向到产品页面
	// 	}
	// });
	
	// res.send({ code: code, message: 'getOpenId' });
});

module.exports = router;
