const request = require('request');
const wxConfig = require('../config').wx;
const commonUtil = require('./index');

/**
 * 获取网页授权 access_token
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 * @param code 授权code码
 */
exports.getAuthAccessToken = code => {
  const accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${ wxConfig.appId }&secret=${ wxConfig.appSecret }&code=${ code }&grant_type=authorization_code`;

  return new Promise((resolve, reject) => {
    // 发起 http 请求
    request.get(accessTokenUrl, (error, response, body) => {
      const resResult = commonUtil.handleWxResponse(error, response, body);
      resolve(resResult);
    });
  });  
};

/**
 * 拉取用户信息 (需 scope为 snsapi_userinfo)
 * @param authAccessToken 授权 access_token
 * @param userOpenid 用户的唯一标识
 */
exports.getUserInfo = (authAccessToken, userOpenid) => {
  const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${ authAccessToken }&openid=${ userOpenid }&lang=zh_CN`;

  return new Promise((resolve, reject) => {
    // 发起 http 请求
    request.get(userInfoUrl, (error, response, body) => {
      const resResult = commonUtil.handleWxResponse(error, response, body);
      resolve(resResult);
    });
  });  
};

/**
 * 获取普通 access_token
 */
exports.getAccessToken = () => {
  const accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ wxConfig.appId }&secret=${ wxConfig.appSecret }`;

  return new Promise((resolve, reject) => {
    // 发起 http 请求
		request.get(accessTokenUrl, (error, response, body) => {
			const resResult = commonUtil.handleWxResponse(error, response, body);
			resolve(resResult);
		});
	});
};

/**
 * 根据普通 access_token 获取 jsapi_ticket
 * @param accessToken 普通 access_token
 */
 exports.getJsApiTicket = accessToken => {
	const jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ accessToken }&type=jsapi`;

	return new Promise((resolve, reject) => {
    // 发起 http 请求
		request.get(jsapiTicketUrl, (error, response, body) => {
			const resResult = commonUtil.handleWxResponse(error, response, body);
			resolve(resResult);
		});
	});
};

/**
 * 生成随机字符串
 */
exports.createNonceStr = () => {
  // 生成随机数转化成36进制,截取2-15位
  return Math.random().toString(36).substr(2, 15);
};

/**
 * 生成随机时间戳
 */
exports.creatTimeStamp = () => {
  return parseInt(new Date().getTime() / 1000) + '';
};
