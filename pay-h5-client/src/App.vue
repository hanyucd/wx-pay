<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import utils from './utils/index';
import { wechatRedirect, getWechatConfigApi } from '@/api';

export default {
  name: 'App',
  data() {
    return {};
  },
  mounted() {
    this._checkUserAuth();
  },
  methods: {
    /**
     * 检查用户是否授权过
     */
    _checkUserAuth() {
      let openId = this.$cookie.get('openId');
      console.log('App cookie:', openId);

      if (!openId) {
        const locOriginUrl = location.origin; // 当前域名路径
        window.location.href = wechatRedirect(locOriginUrl);
      } else {
        this._getWechatConfig();
      }
      // 演示网页授权
      // const appid = 'wx89d78fda8c962552';
      // let redirectUri = encodeURIComponent('http://127.0.0.1:8080'); //处理域名
      // let redirectUri = encodeURIComponent('http://0d729f3e3886.ngrok.io'); //处理域名
      // let scope = 'snsapi_userinfo';
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${ appid }&redirect_uri=${ redirectUri }&response_type=code&scope=${ scope }&state=STATE#wechat_redire`;
    },
    /**
     * 获取微信配置信息
     */
    async _getWechatConfig() {
      let result = await getWechatConfigApi(location.href);
      console.log(result);
      // wx.config({
      //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //   appId: data.appId, // 必填，公众号的唯一标识
      //   timestamp: data.timestamp, // 必填，生成签名的时间戳
      //   nonceStr: data.nonceStr, // 必填，生成签名的随机串
      //   signature: data.signature,// 必填，签名
      //   jsApiList: data.jsApiList // 必填，需要使用的JS接口列表
      // });
      
      wx.ready(() => {
        utils.initShareInfo(wx);
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
