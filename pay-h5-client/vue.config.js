module.exports = {
  lintOnSave: false, // 是否开启eslint
  devServer: {
    // 设置主机地址
    // host: 'm.hanyu.com',
    // host: '127.0.0.1',
    host: '192.168.5.96',
    disableHostCheck: true,
    // 设置默认端
    port: 8080,
    // 设置代理
    proxy: {
      /**
       * changeOrigin:true
       * /api/test
       * http://localhost:5000/test
       * 
       * changeOrigin:false
       * /api/test
       * http://localhost:5000/api/test
       */
      '/api': {
        // 设置目标API地址
        // target: 'http://localhost:3000',
        target: 'http://192.168.5.96:3000',
        // 如果要代理 websockets
        ws: false,
        // 将主机标头的原点改为目标URL
        changeOrigin: false
      }
    }
  }
}
