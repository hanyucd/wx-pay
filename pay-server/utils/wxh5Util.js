const request = require('request');
const wxConfig = require('../config').wx;
const commonUtil = require('./index');

/**
 * 获取网页授权access_token
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
