const cloud = require('wx-server-sdk');
cloud.init();

const envId = 'dev-8gp4mm3fd0347f01';
const functionName = 'pay-callback';
const subMchId = '1601882117';

/**
 * 统一下单
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { money } = event;

  const attach = '支付附加数据';
  const body = '小程序支付';
  const nonceStr = _createNonceStr();
  const outTradeNo = _createOutTradeNo();
  const totalFee = Number(money) * 100;

  const res = await cloud.cloudPay.unifiedOrder({
    openid, // 用户 openid
    subMchId, // 子商户号
    totalFee, // 支付金额 单位为分
    envId, // 结果通知回调云函数环境
    functionName, // 结果通知回调云函数名
    outTradeNo, // 创建订单号
    attach, // 附加数据
    body, // 主体内容
    nonceStr, // 随机字符串
    tradeType: 'JSAPI', // 交易类型
    spbillCreateIp : '127.0.0.1', // 终端IP
  });
  console.log(res);

  const { returnCode, payment } = res;
  if (returnCode !== 'SUCCESS') return { message: '请求支付订单失败' };
  
  return { payment };
};

/**
 * 创建随机字符串
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
 * 
 * 创建订单号
 */
const _createOutTradeNo = () => {
  const date = new Date(); // 当前时间
  // 年
  const Year = `${ date.getFullYear() }`;
  // 月
  const Month = `${ date.getMonth() + 1 < 10 ? `0${ date.getMonth() + 1 }` : date.getMonth() + 1 }`;
  // 日
  const Day = `${ date.getDate() < 10 ? `0${ date.getDate() }` : date.getDate() }`;
  // 时
  const hour = `${ date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() }`;
  // 分
  const min = `${ date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes() }`;
  // 秒
  const sec = `${ date.getSeconds() < 10 ? `0${ date.getSeconds() }` : date.getSeconds() }`;
  // 时间
  const formateDate = `${ Year }${ Month }${ Day }${ hour }${ min }${ sec }`;
  // console.log('时间:', formateDate);

  return `${ Math.round(Math.random() * 1000) }${ formateDate + Math.round(Math.random() * 89 + 100).toString()}`;
};
