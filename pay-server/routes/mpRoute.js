const express = require('express');
const router = express.Router();

const request = require('request');
const { mp: mpConfig, baseUrl } = require('../config');
const commonUtil = require('../utils');
const mpPayUtil = require('../utils/mpPayUtil');
const dbDao = require('../dao/db');

/**
 * 获取小程序 openid & session_key
 * @return {*} code 小程序登陆 code
 */
router.get('/getSession', async (req, res) => {
  const { code } = req.query;
  // 获取code失败
  if (!code) return res.send({ code: 1001, data: null, mess: '未获取到 code' });

  const sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${ mpConfig.appId }&secret=${ mpConfig.appSecret }&js_code=${ code }&grant_type=authorization_code`;
  // 发起 http 请求
  request.get(sessionUrl, (error, response, body) => {
    const resResult = commonUtil.handleWxResponse(error, response, body);
    res.send(resResult);
  })
});

/**
 * 授权登录
 * @param userInfo 用户信息 + openid
 */
 router.get('/login', async (req, res) => {
   const userInfo = JSON.parse(req.query.userInfo) // 字符串转对象
   // 获取用户信息失败
   if (!userInfo) return res.send({ code: 1001, data: null, mess: '用户信息不能为空' });

   // 查询当前用户是否已经注册
   const userResult = await dbDao.dbQuery({ openid: userInfo.openid }, 'user_mp');
  //  console.log('查询用户:', userResult);
   if (userResult.code !== 0) return res.send(userResult); // 数据库查询失败

   // 有此用户信息
  if (userResult.data.length > 0) return res.send(commonUtil.resSuccess({ userId: userResult.data[0]._id }));

  // 没有此用户信息，添加到数据库中
  let insertData = await dbDao.dbInsert(userInfo, 'user_mp');
  if (insertData.code !== 0) console.log(insertData); // 插入数据失败
  // console.log('插入用户:', insertData);
   
  // 添加成功
  res.send(commonUtil.resSuccess({ userId: insertData.data.insertedId }))
 });

 /**
  * 微信支付下单 获取小程序端支付所需参数
  */
router.get('/v2Pay', async (req, res) => {
  const openid = req.query.userOpenid; // 用户的 openid
  const total_fee = Number(req.query.money) * 100; // 支付金额 单位为分
  const attach = '支付附加数据'; // 附加数据
  const body = '小程序支付';  // 主体内容
  const notify_url = `${ baseUrl }/api/mp/payCallback`; // 异步接收微信支付结果通知的回调地址，通知 url必须为外网可访问的url，不能携带参数。公网域名必须为 https
  const spbill_create_ip = '192.168.5.96'; // 终端ip (可填本地路由 ip)
  
  const param = { openid, attach, body, total_fee, notify_url, spbill_create_ip };
  const payParam = await mpPayUtil.v2getPayParam(param);
  if (!payParam) return res.send(commonUtil.resFail('创建支付订单出错'));

  res.send(commonUtil.resSuccess(payParam));
});

/**
 * 支付结果通知 (需保证小程序上线后才能回调) 需要为 POST
 * 返回结果格式为 XML
 * 
 * 此接口中编写相关业务逻辑、如支付成功后写入数据库等操作
 * https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_7&index=8
 */
router.post('/payCallback', async (req, res) => {
  console.log(req.body.xml);
  // json 转 xml
  const _json2Xml = json => {
    let _xml = '';
    Object.keys(json).map((key) => {
        _xml += `<${ key }>${ json[key ]}</${ key }>`
    });
    return `<xml>${ _xml }</xml>`;
  }
  const sendData = { return_code: 'SUCCESS', return_msg: 'OK' };
  res.end(_json2Xml(sendData));
});

module.exports = router;
