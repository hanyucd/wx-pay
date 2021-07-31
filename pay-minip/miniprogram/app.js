const api = require('./api/index');
const fetchReq = require('./api/request');
const routeNavTo = require('./utils/routeUtil');
const config = require('./config/index');

const env = 'dev'; // 环境变量 dev(开发)、prod(生产)

// 挂载到全局 可让非 pages 页面使用
App.version = '1.0.0'; // 开发版本 后期做埋点统计，后台打印日志看目前处于哪个版本
App.config = config[env];  // 根据环境变量 获取对应的配置信息
App.config.env = env;

App({
  $api: api, // 全局挂载 api，供 pages 使用
  $fetchReq: fetchReq, // 全局挂载 http 请求，供 pages 使用
  $routeNavTo: routeNavTo, // 全局挂载 路由导航，供 pages 使用
  
  globalData: {
    userInfo: null, // 用户信息
  },
  
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
  },
});

// console.log(App.config)
