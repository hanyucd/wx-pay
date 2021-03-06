const storageUtil = require('./../../utils/storageUtil');
const app = getApp();

Page({
  data: {
    moneyIdx: -1,
    moneyList: [
      { money: 0.01, text: '1分' },
      { money: 0.2, text: '2角' },
      { money: 1, text: '1元' },
      { money: 10, text: '10元' },
    ]
  },
  onLoad(query) {},
  /**
   * 选择净额
   */
  changeMoney(event) {
    const { moneyIdx } = event.currentTarget.dataset;
    this.setData({ moneyIdx });
  },
  /**
   * 点击支付
   */
  async clickPay() {
    const { moneyIdx, moneyList } = this.data;
    const userOpenid = storageUtil.getItemStorage('openId');
    if (!userOpenid) return wx.showToast({ title: '无用户openid', icon: 'none' });
    if (moneyIdx < 0) return wx.showToast({ title: '请选择金额', icon: 'none' });
    const money = moneyList[moneyIdx].money;

    this._v2Pay({ userOpenid, money }); // 微信支付 v2
    // this._cloudPay({ money }); // 云支付
  },
  /**
   * 微信支付 v2
   */
  async _v2Pay(param) {
    const { userOpenid, money } = param;
    try {
      // 发起 http 请求获取支付参数
      const { data: payParam } = await app.$fetchReq(app.$api.v2Pay, { userOpenid, money });
      // 调起支付 api
      wx.requestPayment({
        timeStamp: payParam.timeStamp,
        nonceStr: payParam.nonceStr,
        package: payParam.package,
        paySign: payParam.paySign,
        signType: payParam.signType,
        success: res => {
          console.log(res);
          if (res.errMsg == 'requestPayment:ok') wx.showToast({ title: '支付成功', icon: 'success' });
        },
        fail: error => {
          console.log(error);
          if (error.errMsg == 'requestPayment:fail cancel') wx.showToast({ title: '支付取消', icon: 'none' });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * 云支付
   */
  async _cloudPay({ money }) {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      const result = (await wx.cloud.callFunction({
        name: 'pay-req',
        data: { money }
      })).result;
      const { payment } = result;
      // 调起支付 api
      wx.requestPayment({
        ...payment, // 根据获取到的参数调用支付 API 发起支付
        success: res => {
          console.log(res);
          if (res.errMsg == 'requestPayment:ok') wx.showToast({ title: '支付成功', icon: 'success' });
        },
        fail: error => {
          console.log(error);
          if (error.errMsg == 'requestPayment:fail cancel') wx.showToast({ title: '支付取消', icon: 'none' });
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.log(error);
    }
  }
})
