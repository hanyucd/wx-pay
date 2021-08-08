const express = require('express');
const router = express.Router();

const cache = require('memory-cache');
const createHash = require('create-hash');
const wxConfig = require('../config').wx;
const baseUrl = require('../config').baseUrl;
const wxh5Util = require('../utils/wxh5Util');
const commonUtil = require('../utils');
const dbDao = require('../dao/db');

/**
 * 用户授权重定向
 */
router.get('/redirect', (req, res) => {
  let redirectUrl = req.query.url; // 最终重定向的地址 -> 跳转回前端的页面
  
});
