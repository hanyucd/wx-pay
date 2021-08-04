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
        },
        fail: error => {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
})
