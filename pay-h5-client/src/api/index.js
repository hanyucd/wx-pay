import request from '@/utils/http';

const baseUrl = 'http://localhost:3000/api';

/**
 * 获取微信配置
 * @param {*} href 路由地址 后台根据当前url地址进行签名
 */
//  export const wechatConfig = async href => {
//    return request({
//      url: `${ baseUrl }/api/wechat/jssdk?url=${href}`,
//      method: 'get'
//    });
// };

/**
 * 获取微信配置
 */
export const getWechatConfig = href => {
  return request({
    url: `${ baseUrl }/api/wechat/jssdk?url=${ href }`,
    method: 'get'
  });
};




/**
 * 微信重定向
 * @param {*} url 重定向地址
 * encodeURIComponent('http://m.baidu.com/index')
 * http%3A%2F%2Fm.51purse.com%2F%23%2Findex
 */
 export const wechatRedirect = url => {
  url = window.encodeURIComponent(url)
  return `/api/wechat/redirect?url=${ url }&scope=snsapi_userinfo`
};




// export default {
//   wechatRedirect: '/api/wechat/redirect?url=http%3A%2F%2Fm.51purse.com%2F%23%2Findex&scope=snsapi_userinfo',
//   wechatConfig: '/api/wechat/jssdk',
//   getUserInfo: '/api/wechat/getUserInfo',
//   payWallet: '/api/wechat/pay/payWallet'
// };
