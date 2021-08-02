# 微信支付 h5 & 小程序

## 笔记

- 开发前配置
  - 服务端配置 (本机路由ip + 端口) 可真机访问
  - pay-h5-client & pay-server config 全局配置 baseUrl (本机路由ip)
  - 测试号配置 网页授权回调域名完成网页授权登录 (本机路由ip + 端口)
  - 测试号配置 JS接口安全域名 通过关注该测试号，开发者即可在该域名下调用微信开放的JS接口 (本机路由ip)

- 使用测试号完成微信网页授权登录
  - 网页授权5步 注意：网页授权access_token和普通access_token的区别

- 微信网页配置jssdk 分享朋友圈 & 好友

- 数据库 mongodb 存储数据； node模块: mongodb 连接

- pay-minip 微信小程序 & 云开发
  - 封装 router 
  - 封装 storage 
  - 封装 request
  - App 全局挂载 

- 微信支付

1. 扫码支付:  
   商户在pc端展示一个支付二维码，用户使用微信扫一扫功能，扫码后实现付款的支付方式。

2. JSAPI 支付:  
   商户在微信APP内（微信浏览器）打开H5网页，通过微信支付实现付款的支付方式。

3. H5支付:  
   商户在微信APP以外 的手机浏览器打开H5网页，通过微信支付实现付款的支付方式。

4. 小程序支付:  
   商户在小程序内，通过微信支付实现付款功能的支付方式。

   https://zhuanlan.zhihu.com/p/189408579

   https://juejin.cn/post/6962793524643233806

   https://www.jianshu.com/p/cc160949ba6b

   https://blog.csdn.net/m0_37857819/article/details/106442901
