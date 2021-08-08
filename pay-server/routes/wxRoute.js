const express = require('express');
const router = express.Router();

const cache = require('memory-cache');
const createHash = require('create-hash');
const wxConfig = require('../config').wx;
const baseUrl = require('../config').baseUrl;
const wxh5Util = require('../utils/wxh5Util');
const commonUtil = require('../utils');
const dbDao = require('../dao/db');

/**
 * 用户授权重定向
 */
router.get('/redirect', (req, res) => {
	let redirectUrl = req.query.url; // 最终重定向的地址 -> 跳转回前端的页面
	let scope = req.query.scope; // 网页应用授权作用域
	cache.put('redirect_url', redirectUrl); // 通过 cache 缓存重定向地址
	
	// const redirect_uri = 'http://127.0.0.1:8080/api/wechat/getOpenId'; // 授权回调地址，用来获取 code
	const redirect_uri = `${ baseUrl }/api/wechat/getOpenId`;
	let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ wxConfig.appId }&redirect_uri=${ redirect_uri }&response_type=code&scope=${ scope }&state=STATE#wechat_redirect`;
	res.redirect(authorizeUrl); // 重定向到微信授权页面
});

/**
 * 根据 code 获取用户的 openid
 */
router.get('/getOpenId', async (req, res) => {
	const code = req.query.code;
	// console.log('code码:', code);
	if (!code) return res.send({ code: 1001, data: null, mess: '未获取到 code' });
	
	const resResult = await wxh5Util.getAuthAccessToken(code); // 根据 code 获取 授权access_token
	// console.log('授权 access_token: ', resResult);
	if (resResult.code != 0) return res.send(resResult); // 请求 授权access_token 失败
	const { access_token, openid } = resResult.data;

	const expire_time = 1000 * 60 * 60 * 2; // 过期时间 2 小时
	// const expire_time = 1000 * 60 * 10; // 过期时间 10 分钟

	// 将 授权access_token, openId 存储到缓存里
	cache.put('auth_access_token', access_token, expire_time);
	cache.put('user_openid', openid, expire_time);
	console.log('缓存 keys：', cache.keys());

	// 根据 openId 查询用户是否有注册
	const userResult = await dbDao.dbQuery({ openid }, 'user_h5');
	// console.log('查询用户:', userResult);
	if (userResult.code !== 0) res.json(userResult); // 数据库查询失败

	// 没有此用户
	if (!userResult.data.length) {
		console.log('没有此用户');
		let userData = await wxh5Util.getUserInfo(access_token, openid); // 拉取用户信息
		let insertData = await dbDao.dbInsert(userData.data, 'user_h5');
		if (insertData.code !== 0) console.log(insertData); // 插入数据失败
		// console.log('插入用户:', insertData);
	}

	res.cookie('openId', openid, { maxAge: expire_time }); // 设置响应 cookie
	const redirectUrl = cache.get('redirect_url'); // 获取缓存的重定向 url
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
router.get('/jssdkConfig', async (req, res) => {
	const url = req.query.url;

	const resResult = await wxh5Util.getAccessToken(); // 获取普通 access_token
	// console.log('普通 access_token: ', resResult);
	if (resResult.code !== 0) return res.send(resResult);
	const { access_token } = resResult.data;
	cache.put('access_token', access_token); // 有效期 7200秒，开发者必须在自己的服务全局缓存access_token

	const resResult2 = await wxh5Util.getJsApiTicket(access_token); // 根据 access_token 获取 ticket 临时票据
	// console.log('jsapiTicket: ', resResult2);
	if (resResult2.code !== 0) return res.send(resResult2);
	const { ticket } = resResult2.data;

	// 签名算法需要的参数值
	const signParamObj = {
		url,
		jsapi_ticket: ticket,
		noncestr: wxh5Util.createNonceStr(),
		timestamp: wxh5Util.creatTimeStamp()
	};
	const signParmStr = wxh5Util.signParamSort(signParamObj); // 排序后的签名参数
	const signature = createHash('sha1').update(signParmStr).digest('hex'); // 进行 sha1 加密, 生成签名 最好加一个 hex 参数
	
	res.send(commonUtil.resSuccess({
		appId: wxConfig.appId, // 必填，公众号的唯一标识
		timestamp: signParamObj.timestamp, // 必填，生成签名的时间戳
		nonceStr: signParamObj.noncestr, // 必填，生成签名的随机串
		signature, // 必填，签名
		jsApiList: [
			'updateAppMessageShareData', // “分享给朋友” 及 “分享到QQ”
			'updateTimelineShareData', // “分享到朋友圈” 及 “分享到QQ空间”
			'chooseWXPay', // 微信支付
			] // 必填，需要使用的 JS 接口列表
	}));
});

module.exports = router;
