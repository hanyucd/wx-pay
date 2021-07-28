import httpRequest from '@/utils/http';
import commonConfig from '@/config/index';

// const baseUrl = 'http://127.0.0.1:8080/api';
const serverBaseUrl = `${ commonConfig.baseUrl }/api`;

/**
 * 
 * 微信重定向
 */
export const wechatRedirect = url => {
  const urlEncode = window.encodeURIComponent(url);
  return `/api/wechat/redirect?url=${ urlEncode }&scope=snsapi_userinfo`
};

/**
 * 获取用户信息
 */
 export const getUserInfoApi = () => {
  return httpRequest({
     url: `${ serverBaseUrl }/wechat/getUserInfo`,
     method: 'get'
   });
};

/**
 * 获取微信配置
 */
export const getWechatConfigApi = href => {
  return httpRequest({
    url: `${ serverBaseUrl }/wechat/jssdkConfig?url=${ href }`,
    method: 'get'
  });
};












// export default {
//   wechatRedirect: '/api/wechat/redirect?url=http%3A%2F%2Fm.51purse.com%2F%23%2Findex&scope=snsapi_userinfo',
//   wechatConfig: '/api/wechat/jssdk',
//   getUserInfo: '/api/wechat/getUserInfo',
//   payWallet: '/api/wechat/pay/payWallet'
// };
