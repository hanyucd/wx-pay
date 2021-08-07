<template>
  <div class="main2">
    支付
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';

export default {
  name: 'Pay',
  data() {
    return {};
  },
  methods: {
    /**
     * 微信支付 v2
     */
    async _v2Pay() {
      // 1. 类似微信小程序支付 首先向后端请求支付参数
      // const { data: payParam } = await 请求 api;

      // 2. 调起支付 api
      wx.chooseWXPay({
        timestamp: payParam.timeStamp,
        nonceStr: payParam.nonceStr,
        package: payParam.package,
        signType: payParam.signType,
        paySign: payParam.paySign,
        success: res => {
          console.log(res);
          if (res.errMsg == 'chooseWXPay:ok') alert('支付成功');
          if (res.errMsg == 'chooseWXPay:fail') alert('支付取消');
        },
        fail: error => {
          console.log(error);
        },
      });
    }
  }
}
</script>

<style>
.main2 {
  height: 100vh;
  background: #000;
  background-image: url('../../assets/image/xiaoyu_bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
