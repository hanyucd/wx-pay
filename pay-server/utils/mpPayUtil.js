const request = require('request');
const { mp: mpConfig, mch: mchConfig } = require('../config');
const commonUtil = require('./index');

/**
 * 生成时间戳 (秒)
 */
const _creatTimeStamp = () => {
  return parseInt(+new Date() / 1000) + '';
};

/**
 * 生成随机字符串 微信支付 v2 需要
 * @param {*} strLen 字符串长度
 */ 
const _createNonceStr = (strLen = 20) => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonceStr = '';
  for (let i = 0; i < strLen; i++) {
    nonceStr += str[Math.floor(Math.random() * str.length)];
  }

  return nonceStr;
};

/**
 * 创建订单号（保证唯一性）
 */
const _createTradeNo = () => {
  let tradeNo = '';
  const timeStampStr = (+new Date() + ''); // 时间戳字符串
  let randomNumstr = '';

  const numStr = '0123456789';
  for (let i = 0; i < 6; i++) {
    randomNumstr += numStr[Math.floor(Math.random() * numStr.length)];
  }
  
  tradeNo = timeStampStr + randomNumstr;
  return tradeNo;
};

/**
 * 生成签名 微信支付 v2 需要
 */ 
const _createSign = signParamObj => {
  // 对对象中的 key 值进行排序 (对所有待签名参数按照字段名 key 的 ASCII 码从小到大排序（字典序）)
  const signParamKeys = Object.keys(signParamObj).sort();
  const stringA = signParamKeys.map(signParamKey => `${ signParamKey }=${ signParamObj[signParamKey] }`).join('&');
  // 拼接商户key
  const stringSignTemp = stringA + `&key=${ mchConfig.mchKey }`;
  
  return {
    signParamKeys,
    stringA,
    stringSignTemp
  };
};

/**
 * 微信统一下单
 * https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
 * @param {*} appid 应用id
 * @param {*} attach 附加数据
 * @param {*} body 主题内容
 * @param {*} mch_id 商户号
 * @param {*} out_trade_no 商户订单号
 * @param {*} nonce_str 随机数
 * @param {*} openid openid
 * @param {*} total_fee 支付金额(分)
 * @param {*} notify_url 回调地址
 * @param {*} spbill_create_ip: ip 地址ip
 */
const _v2createOrder = () => {

};


/**
 * 获取支付参数
 */
exports.v2getPayParam = async param => {
  const { openid, attach, body, total_fee, notify_url, spbill_create_ip } = param;
  const appid = mpConfig.appId; // 微信小程序 appid
  const mch_id = mchConfig.mchId; // 商户 id
  const timeStamp = _creatTimeStamp(); // 时间戳
  const nonce_str = _createNonceStr(); // 随机字符串
  const out_trade_no = _createTradeNo(); // 订单号
  const sign_type = 'MD5'; // 签名类型
  const trade_type = 'JSAPI'; // 交易类型 (小程序支付方式)

  const sign = _createSign({ appid, mch_id, nonce_str, out_trade_no, sign_type, trade_type, openid, attach, body, total_fee, notify_url, spbill_create_ip });
  
  // const paySign = _createSign();

  return {
    timeStamp,
    nonce_str,
    sign,
    signType: 'MD5',
    // paySign
    // package
  }
};
