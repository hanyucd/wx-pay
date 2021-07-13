const express = require('express');
const router = express.Router();

const cache = require('memory-cache');
const wxConfig = require('../../config').wx;

/**
 * 用户授权重定向
 */
router.get('/redirect', function (req, res) {
	let redirectUrl = req.query.url; // 最终重定向的地址->跳转回前端的页面
	let scope = req.query.scope; // 作用域
	let callback = `${redirectUrl}`; // 授权回调地址，用来获取openId
	// cache.put('redirectUrl', redirectUrl) // 通过cache 缓存重定向地址

	console.log(redirectUrl);
	console.log(scope);

	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ wxConfig.appId }&redirect_uri=${callback}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
	console.log(authorizeUrl);
	
	// res.redirect(authorizeUrl);
});

/**
 * 根据code获取用户的 openid
 */
router.get('/getOpenId', async function (req, res) {
	const code = req.query.code;
});

module.exports = router;
