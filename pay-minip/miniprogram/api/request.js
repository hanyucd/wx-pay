const storageUtil = require('../utils/storageUtil');
const systemInfo = wx.getSystemInfoSync(); // 系统信息

// 客户端信息
const clientInfo = {
  'clientType': 'mp', // 客户端类型
  'appnm': 'pay-minip', //项目名
  'model': systemInfo.model, // 设备型号
  'os': systemInfo.system, // 操作系统及版本
  'screen': systemInfo.screenWidth + '*' + systemInfo.screenHeight, // 屏幕尺寸
  'version': App.version, // 小程序版本
  'channel': 'miniprogram' // 渠道
};

/**
 *  封装 http 请求
 */
module.exports = (url, data = {}, option = {} ) => {
  const { loading = true, toast = true, method = 'get' } = option;

  return new Promise((resolve, reject) => {
    loading && wx.showLoading({ title: '加载中...', mask: true });
    
    const serverBaseurl = App.config.serverBaseurl; // 服务端基础地址
    wx.request({
      url: serverBaseurl + url,
      data,
      method,
      header: {
        'content-type': 'application/json',
        'clientInfo': JSON.stringify(clientInfo) // 携带客户端信息
      },
      success: res => {
        // console.log(res);
        const resResult = res.data; // { code: 0, data: '', message: '' }
        if (resResult.code === 0) {
          loading && wx.hideLoading();
          resolve(resResult);
        } else {
          // 如果有 toast 提示会直接结束 loading
          toast ? wx.showToast({ title: resResult.message, icon: 'none', mask: true }) : wx.hideLoading();
          loading && wx.hideLoading();
          reject(resResult);
        }
      },
      fail: error => {
        console.log(error);
        loading && wx.hideLoading();
      },
    });
  });
};
