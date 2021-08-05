const request = require('request');
const { mp: mpConfig, mch: mchConfig } = require('../config');
const crypto = require('crypto');
const xml2js = require('xml2js'); // 引入 xml 解析模块

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
 * 将 obj 转为微信提交 xml 格式，包含签名
 */
const _createXMLData = paramObj => {
  let formData = '';
  formData += '<xml>';

  Object.keys(paramObj).sort().map(itmKey => {
    formData += `<${ itmKey }>${ paramObj[itmKey] }</${ itmKey }>`;
  });

  formData += `</xml>`;
  return formData;
};

/**
 * 生成签名 微信支付 v2 需要
 * 签名算法用的是 md5
 */ 
const _createSign = signParamObj => {
  // 对对象中的 key 值进行排序 (对所有待签名参数按照字段名 key 的 ASCII 码从小到大排序（字典序）)
  const signParamKeys = Object.keys(signParamObj).sort();
  const stringA = signParamKeys.map(signParamKey => `${ signParamKey }=${ signParamObj[signParamKey] }`).join('&'); // a=1&b=2&c=3
  const stringSignTemp = stringA + `&key=${ mchConfig.mchKey }`; // 注：key 为商户平台设置的密钥 key
  // 签名
  const _sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();

  return _sign;
};

/**
 * 创建微信预支付订单 id
 * https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
 */
const _v2createPrePayOrder = async xmlFormData => {
  // 请求微信服务器统一下单接口
  const requrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

  return new Promise((resolve, reject) => {
    request({ url: requrl, method: 'POST', body: xmlFormData }, (error, response, body) => {
      // console.log(body); 微信返回 xml 格式数据
      if (error || response.statusCode !== 200) return reject({ errmsg: '请求微信服务器失败' });

      // 解析 xml 格式数据
      xml2js.parseString(body, (err, result) => {
        if (err) return reject({ errmsg: 'xml解析出错' }); // 解析出错
        const resData = result.xml;
        // console.log('xml解析结果:', resData);
        // 微信返回结果中 return_code 和 result_code 都为 SUCCESS 的时候才有返回的预支付id (prepay_id)
        if (resData.return_code[0] === 'SUCCESS' && resData.result_code[0] === 'SUCCESS' && resData.prepay_id) {
          resolve({ prepay_id: resData.prepay_id[0] });
        } else {
          reject(resData);
        }
      });
    });
  });
};

/**
 * 获取支付参数
 */
exports.v2getPayParam = async param => {
  const { openid, attach, body, total_fee, notify_url, spbill_create_ip } = param;
  const appid = mpConfig.appId; // 微信小程序 appid
  const mch_id = mchConfig.mchId; // 商户 id
  const timeStamp = _creatTimeStamp(); // 时间戳字符串 (秒)
  const nonce_str = _createNonceStr(); // 随机字符串
  const out_trade_no = _createTradeNo(); // 订单号
  const sign_type = 'MD5'; // 签名类型
  const trade_type = 'JSAPI'; // 交易类型 (小程序支付方式)
  // 签名
  const sign = _createSign({ appid, mch_id, nonce_str, out_trade_no, sign_type, trade_type, openid, attach, body, total_fee, notify_url, spbill_create_ip });
  // xml格式数据
  const xmlFormData = _createXMLData({ appid, mch_id, nonce_str, out_trade_no, sign_type, trade_type, openid, attach, body, total_fee, notify_url, spbill_create_ip, sign })

  try {
    // 创建微信预支付 id
    const { prepay_id } = await _v2createPrePayOrder(xmlFormData);
    if (!prepay_id) return '';
    
    const payParamObj = {
      appId: appid, // 必须添加上 appid, 否则报错：支付验证签名失败
      timeStamp,
      nonceStr: nonce_str,
      signType: 'MD5',
      package: `prepay_id=${ prepay_id }`
    };
    // 支付签名
    const paySign = _createSign(payParamObj);
    
    return {
      timeStamp: payParamObj.timeStamp,
      nonceStr: payParamObj.nonceStr,
      signType: payParamObj.signType,
      package: `prepay_id=${ prepay_id }`,
      paySign
    };
  } catch (error) {
    console.log('创建支付订单出错', error);
    return '';
  }
};
