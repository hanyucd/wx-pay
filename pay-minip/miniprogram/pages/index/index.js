const storageUtil = require('./../../utils/storageUtil');
const app = getApp();

Page({
  data: {
    userId: storageUtil.getItemStorage('userId')
  },
  onLoad() {
    // 判断用户是否登录
    if (!this.data.userId) this._getSession();
  },
  onShareAppMessage() {
    return {
      title: '西行记',
      path: '/pages/index/index',
      imageUrl: '/images/xiaoyu_bg.jpg'
    }
  },
  /**
   * 获取登录的 code 并返回用户 openid
   */
  _getSession() {
    // 获取登录凭证 code
    wx.login({
      success: async res => {
        const { code } = res;
        // 发起 http 请求
        const { data } = await app.$fetchReq(app.$api.getSession, { code });
        // openid 存储 localstorage
        storageUtil.setItemStorage('openId', data.openid);
      }
    });
  },
  /**
   * 授权获取微信用户信息
   */
   getUserProfile() {
     wx.getUserProfile({
      desc: '需要授权完成注册',
      lang: 'zh_CN',
      success: async res => {
        let { userInfo } = res;
        userInfo.openid = storageUtil.getItemStorage('openId'); // 携带 openId 传给后端
        // 发起 http 请求
        const { data } = await app.$fetchReq(app.$api.login, { userInfo });
        // userId 存储 localstorage
        storageUtil.setItemStorage('userId', data.userId);
        this.setData({ userId: data.userId });
      }
     });
  },
  /**
   * 页面跳转
   */
  navTo() {
    app.$routeNavTo('payPage');
  }
})
