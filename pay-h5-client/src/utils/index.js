import commonConfig from '@/config';

/**
 * 初始化分享信息
 */
const initShareInfo = wx => {
  let shareInfo = {
    title: '西行纪', // 分享标题
    desc: '杀心大神对战三眼神将', // 分享描述
    link: `${ commonConfig.baseUrl }/index`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    imgUrl: 'https://img2.doubanio.com/view/photo/sqxs/public/p2536354771.jpg', // 分享图标
    success: () => {},
    fail: () => {},
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
