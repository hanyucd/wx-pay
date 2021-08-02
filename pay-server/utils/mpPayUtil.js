const request = require('request');
const mpConfig = require('../config').mp;
const commonUtil = require('./index');

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
exports.v2createOrder = () => {

};
