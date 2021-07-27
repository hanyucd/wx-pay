
/**
 * 处理微信请求返回信息统一处理
 */
exports.handleWxResponse = (error, response, body) => {
  // 微信服务器请求失败
  if (error || response.statusCode !== 200) return this.resFail(error, 10009);

  const resData = JSON.parse(body); // JSON 解析响应
  // 微信请求服务发生错误
  if (resData && resData.errcode) return this.resFail(resData.errmsg, resData.errcode);

  // 请求成功
  return this.resSuccess(resData);
};

/**
 * 封装成功响应
 */
exports.resSuccess = (data = null) => {
  return { code: 0, data, message: '成功' }
};

/**
 * 封装失败响应
 */
exports.resFail = (message = '服务器错误', code = 10001) => {
  return { message, code, data: null };
};
