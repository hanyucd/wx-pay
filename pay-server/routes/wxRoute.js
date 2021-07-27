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
	cache.put('redirect_url', redirectUrl); // 通过 cache 缓存重定向地址
	
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
	
	// 根据 code 获取授权 access_token
	const resResult = await wxh5Util.getAuthAccessToken(code);
	console.log('响应结果：', resResult);
	// 请求 access_token 失败
	if (resResult.code != 0) return res.send(resResult);

	// const expire_time = 1000 * 60 * 60 * 2; // 过期时间 2个小时
	const expire_time = 1000 * 60 * 10; // 过期时间 10 分钟
	const { access_token, openid } = resResult.data;

	// 将 授权access_token, openId 存储到缓存里
	cache.put('auth_access_token', access_token, expire_time);
	cache.put('user_openid', openid, expire_time);
	console.log('缓存 keys：', cache.keys())

	res.cookie('openId', openid, { maxAge: expire_time }); // 设置响应 cookie
	const redirectUrl = cache.get('redirect_url');
	res.redirect(redirectUrl); // 重定向到产品页面	
});

/**
 * 获取用户信息
 */
router.get('/getUserInfo', async (req, res) => {
	const authAccessToken = cache.get('auth_access_token');
	const userOpenid = cache.get('user_openid');
	const resResult = await wxh5Util.getUserInfo(authAccessToken, userOpenid);

	res.send(resResult);
});

/**
 * 获取 jssdk 配置
 */
router.get('/jssdk', async (req, res) => {
	const url = req.query.url;
	console.log('url:', url);

	// 获取普通 access_token
	const resResult = await wxh5Util.getAccessToken();
	if (resResult.code != 0) return res.send(resResult);
	const { access_token } = resResult.data;

	console.log('普通 access_token: ', resResult)
	res.send({ access_token });
});

module.exports = router;
