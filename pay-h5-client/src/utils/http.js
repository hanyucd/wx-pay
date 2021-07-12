import axios from 'axios'
// import { storage, sessionStorage } from '@/utils/storage'
// import router from '../router/index'

const service = axios.create({
  timeout: 5000, // 设置超时时间
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(config => {
  config.contentType && (config.headers['Content-Type'] = config.contentType)
  return config;
  }, error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(res => {
    //可以根据后端的系统而相应的做调整
  if (res.data.code == 0) {
    return res.data
  }
  return Promise.reject(res.data);
  }, async error => {
    if (error.request) {
      // if (error.request.status === 0) {};
    } else if (error.response) {
    if (error.response.status === 400) {
      //请求参数有问题
    } else if (error.response.status === 404) {
      //未找到资源
      console.log('未找到资源')
    } else if (error.response.status === 401) {
      //请先登录
      console.log('请先登录')
    } else if (error.response.status === 500) {
      //服务器异常
      console.log('服务器异常')
    }
    }
    return Promise.reject(error);
  }
);

export default service;
