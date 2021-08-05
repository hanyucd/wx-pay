
module.exports = {
  // 开发环境配置
  dev: {
    // serverBaseurl: 'http://localhost:3000'
    // serverBaseurl: 'http://192.168.5.96:3000' // 本机路由ip域名 + 端口
    serverBaseurl: 'http://192.168.3.6:3000' // 本机路由ip域名 + 端口
  },
  // 生产环境配置
  prod: {
    serverBaseurl: 'http://127.0.0.1:3000'
  }
}
