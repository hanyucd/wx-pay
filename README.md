# 微信支付小程序 & h5

## 介绍

- pay-h5-client 微信网页 h5
- pay-minip 微信小程序
- pay-server 服务端

## 首先

修改服务端配置信息: **pay-server/config/index.js** 

```js
 module.exports = {
  // baseUrl: 'http://x.x.x.x:8080',
  baseUrl: 'http://192.168.5.133:8080', // 可填本机路由ip域名 + 端口
  // 微信公众号
  wx: {
    appId: 'xxxxxx', // 测试号 appid (公众号)
    appSecret: 'xxxxxx'
  },
  // 微信小程序
  mp: {
    appId: 'xxxxxx', // 微信小程序 appid (个人)
    appSecret: 'xxxxxx'
  },
  // 商户号信息
  mch: {
    mchId: 'xxxxxx', // 商户 id
    mchKey: 'xxxxxx' // 商户 key
  },
}
```

## 微信网页授权登录 (使用测试号)

用户在微信客户端中访问第三方网页，公众号可以通过微信网页授权机制，来获取用户基本信息，进而实现业务逻辑.

**注：** 先将测试号管理平台中 **网页服务的网页授权获取用户基本信息** 授权回调页面域名修改为 192.168.5.96:8080 (可填本机路由ip域名 + 端口) 或者 127.0.0.1:8080.

#### 微信授权流程介绍 (参数都在服务端完成并返回)

1. 前端引导用户进入授权页面同意授权，此时会调用微信 api 获取 code

2. 用户同意授权后会带上 code 参数请求回调地址

3. 拿到回调中的 code + appId +  appSecret 换取网页授权 access_token 和 openid

4. 通过网页授权 access_token 和 openid 获取用户基本信息（如果有 unionid 还会获取到 unionid 参数）、

5. 根据用户 openid 查询数据库是否有此用户记录，有则直接返回用户信息，无则先存库再返回用户信息

#### 关于网页授权的两种 scope 的区别说明

- scope = snsapi_base 发起的网页授权，是用来获取进行页面的用户的openid的，并且是静默授权并自动跳转到回调页。用户感知的就是直接进入了回调页(往往是业务页面).

- scope = snsapi_userinfo 发起的网页授权，是用来获取用户的基本信息，但这种授权需要用户手动同意，并且由于用户同意过，所以无需关注，就可在授权后获取该用户的基本信息.

#### 关于网页授权 access_token 和普通 access_token 的区别

- 微信网页授权是通过 OAuth2.0 机制实现的，在用户授权给公众号后，公众号可以获取到一个网页授权特有的接口调用凭证（网页授权 access_token ），通过网页授权 access_token 可以进行授权后接口调用，如获取用户基本信息.

- 其他微信接口，需要通过基础支持中的 “获取access_token” 接口来获取到的普通 access_token 调用.

## 微信网页配置 jssdk 分享朋友圈 & 好友 (参数都在服务端完成并返回)

**注：** 先将测试号管理平台中 **JS接口安全域名** 修改为 192.168.5.96 (可填本机路由ip域名) 或者 127.0.0.1

前端(vue)首先 npm install weixin-js-sdk --save, 就可以使用关键字: wx，调用 api.

1. 首先调用服务端获取 wx.config({}) 所需参数

2. 服务端 pay-server/routes/wxRoute.js 定义了路由 & 参数获取

3. 首先服务端先获取普通 access_token，用第一步拿到的 access_token 采用 http GET方式请求获得 jsapi_ticket, 最后在进行签名：签名生成规则如下：参与签名的字段包括 noncestr（随机字符串）, 有效的 jsapi_ticket, timestamp（时间戳）, url（当前网页的 URL，不包含 # 及其后面部分）。对所有待签名参数按照字段名的 ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即 key1=value1&key2=value2… ）拼接成字符串 string1。这里需要注意的是所有参数名均为小写字符。再对 string1 作sha1 加密

4. 前端拿到服务端返回的配置参数后，添加到 wx.config({}) 中，之后在 wx.ready() 添加分享朋友圈 & 好友 api

## 微信小程序

- pay-minip/api文件下统一 定义 api & 封装请求

- app.js 中 App({}) 添加 $api: api, 全局挂载 api 供 pages 使用；$fetchReq: fetchReq 全局挂载 http 请求供 pages 使用


## 微信小程序支付v2版 (网页h5支付类似)

**注：** 微信支付目前已经出了 v3版

相关文章我已发掘金: [文章地址](https://juejin.cn/post/6844903924172881927)



## 笔记

- 开发前配置
  - 服务端配置 (本机路由ip + 端口) 可真机访问
  - pay-h5-client & pay-server config 全局配置 baseUrl (本机路由ip)
  - 测试号配置 网页授权回调域名完成网页授权登录 (本机路由ip + 端口)
  - 测试号配置 JS接口安全域名 通过关注该测试号，开发者即可在该域名下调用微信开放的JS接口 (本机路由ip)

- 使用测试号完成微信网页授权登录
  - 网页授权5步 注意：网页授权access_token和普通access_token的区别
  - https://mp.weixin.qq.com/s/BQPn_r5pcwZO3tzqnoTiKg

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

   支付签名(sign): 是指将前面所有 参数 加密后的字符
   参数: 可以按照自己的需要进行选择性传参，但是接口文档里要求必填，那就必须要传，否则接口会调用失败。
   
   签名算法是比较麻烦的一步，整个步骤就是：把你所有要传的非空参数，按字典顺序拼接起来得到stringA，然后加上key

   https://zhuanlan.zhihu.com/p/189408579

   https://juejin.cn/post/6962793524643233806

   https://www.jianshu.com/p/cc160949ba6b

   https://blog.csdn.net/m0_37857819/article/details/106442901

   https://zhuanlan.zhihu.com/p/147755175

   https://blog.csdn.net/yemuxia_sinian/article/details/86672495

   https://cloud.tencent.com/developer/article/1653813

5. 微信支付结果通知 notify_url(需要为 https, 同时是 post)  可用 ngrok 做内网穿透

   微信支付平台会发送一个回调请求，通知支付订单的处理结果。该请求传入的参数是xml格式

   将传回来的参数除了sign以外的参数签名 结果与所传回来的 sign 比较，一样则校验成功

   https://blog.csdn.net/BigChicken3/article/details/93310440

   https://blog.csdn.net/weixin_41888375/article/details/89322560


 5. 微信云支付:  

    https://juejin.cn/post/6855651062733340685
