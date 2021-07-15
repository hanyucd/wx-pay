import request from '@/utils/http';

const baseUrl = 'http://127.0.0.1:3000/api';

/**
 * 微信重定向
 * @param {*} url 重定向地址
 * encodeURIComponent('http://m.baidu.com/index')
 * http%3A%2F%2Fm.51purse.com%2F%23%2Findex
 */
 export const wechatRedirect = () => {
  let url = window.encodeURIComponent(`${ baseUrl }/wechat/getOpenId`);
  return request({
    url: `${ baseUrl }/wechat/redirect?url=${ url }&scope=snsapi_base`,
    method: 'get'
  })
};

/**
 * 获取微信配置
 */
export const getWechatConfig = href => {
  return request({
    url: `${ baseUrl }/api/wechat/jssdk?url=${ href }`,
    method: 'get'
  });
};















// export default {
//   wechatRedirect: '/api/wechat/redirect?url=http%3A%2F%2Fm.51purse.com%2F%23%2Findex&scope=snsapi_userinfo',
//   wechatConfig: '/api/wechat/jssdk',
//   getUserInfo: '/api/wechat/getUserInfo',
//   payWallet: '/api/wechat/pay/payWallet'
// };
