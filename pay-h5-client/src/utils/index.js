
/**
 * 初始化分享信息
 */
const initShareInfo = function(wx) {
  let shareInfo = {
    title: '慕课支付分享专项课程', // 分享标题
    desc: '欢迎学习慕课支付分享专项课程', // 分享描述
    link: 'http://m.imooc.com/index', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: '' // 分享图标
  };
  // wx.onMenuShareAppMessage(shareInfo)
  // wx.onMenuShareTimeline(shareInfo)
  // wx.onMenuShareQQ(shareInfo)
  // wx.onMenuShareQZone(shareInfo)
  wx.updateAppMessageShareData(shareInfo); // 分享给朋友
  wx.updateTimelineShareData(shareInfo); // 分享到朋友圈
}; 

export default {
  initShareInfo
};
