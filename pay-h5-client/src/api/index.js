import request from '@/utils/http';

// const baseUrl = 'http://127.0.0.1:3000/api';
const baseUrl = 'http://127.0.0.1:8080/api';
// const baseUrl = 'http://m.hanyu.com:1024/api';

/**
 * 微信重定向
 * @param {*} url 重定向地址
 * encodeURIComponent('http://m.baidu.com/index')
 * http%3A%2F%2Fm.51purse.com%2F%23%2Findex
 */
//  export const wechatRedirectApi = () => {
//   let url = window.encodeURIComponent(`${ baseUrl }/wechat/getOpenId`);
//   return request({
//     url: `${ baseUrl }/wechat/redirect?url=${ url }&scope=snsapi_userinfo`,
//     method: 'get'
//   });
// };

/**
 * 
 * 微信重定向
 */
export const wechatRedirect = url => {
  const urlEncode = window.encodeURIComponent(url);
  return `/api/wechat/redirect?url=${ urlEncode }&scope=snsapi_userinfo`
};

/**
 * 获取微信配置
 */
export const getWechatConfig = href => {
  return request({
    url: `${ baseUrl }/wechat/jssdk?url=${ href }`,
    method: 'get'
  });
};












// export default {
//   wechatRedirect: '/api/wechat/redirect?url=http%3A%2F%2Fm.51purse.com%2F%23%2Findex&scope=snsapi_userinfo',
//   wechatConfig: '/api/wechat/jssdk',
//   getUserInfo: '/api/wechat/getUserInfo',
//   payWallet: '/api/wechat/pay/payWallet'
// };
