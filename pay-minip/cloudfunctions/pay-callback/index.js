const cloud = require('wx-server-sdk');
cloud.init();

/**
 * 结果通知回调云函数名
 */
exports.main = async (event, context) => {
  console.log(event);
  // 收到支付结果回调的云函数必须返回一个 { "errcode": 0 } 的对象
  return { errcode: 0 };
};
