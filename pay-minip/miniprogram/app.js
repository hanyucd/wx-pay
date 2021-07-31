const api = require('./api');
const request = require('./api/request');
const envConfig = require('./config').envConfig;

const env = 'dev';

App.version = '1.0.0'; // 开发版本 后期做埋点统计，后台打印日志看目前处于哪个版本
App.config = envConfig[env];  // 根据环境变量获取对应的配置信息
App.config.env = env;

App({
  $api: api, // 全局挂载 api，供全局使用

  onLaunch: () => {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
