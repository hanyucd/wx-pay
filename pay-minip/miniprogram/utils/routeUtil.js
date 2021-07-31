/**
 * 通用的路由跳转文件
 */

const routePage = {
  'indexPage': "/pages/index/index",
  'payPage': "/pages/pay/pay",
};

/**
 * 对象转换为 & 符连接的字符串
 * @param {Object} data
 * @returns
 */
const _parseObjParam = data => {
  let arr = [];
  // let data = { a:1, b:2, c:3 } a=1&b=2&c=3
  for (const key in data) {
    arr.push(`${ key }=${ data[key] }`);
  }
  return arr.join('&');
};

/**
 * 路由跳转
 * @param {*} openType  跳转类型
 * redirect, reLaunch, switchTab, back, navigateTo
 * @param {*} url 路由地址
 * @param {Number} backNum openType='back'时使用，返回上级页面（多级）
 */
const _navTo = (openType, url, backNum) => {
  let obj = { url };
  
  switch (openType) {
    case 'redirect':
      wx.redirectTo(obj);
      break;
    case 'reLaunch':
      wx.reLaunch(obj);
      break;
    case 'switchTab':
      wx.switchTab(obj);
      break;
    case 'back':
      wx.navigateBack({ delta: backNum || 1 });
      break;
    default:
      wx.navigateTo(obj);
      break;
  }
};

/**
 * 页面跳转
 * push('index')
   push({ path: '/index', query: { userId:123 } })
 * @param {*} pageName 
 * @param {*} option 
 * query  传递参数
 * openType  跳转类型
 * duration 持续时间
 * backNum openType='back'时使用，返回上级页面（多级）
 */
module.exports = (pageName, option = {}) => {
  // 通过 push('index') 这种方式跳转
  if (typeof pageName == 'string') {
    option.pageName = pageName;
  } else {
    option = pageName;
  }

  const url = routePage[option.pageName];
  // 传递参数 跳转类型 持续时间
  const { query = {}, openType, duration, backNum } = option;
  const paramStr = _parseObjParam(query);
  paramStr && (url += `?${ paramStr }`); // 路径添加 query 参数

  duration ? setTimeout(() => { _navTo(openType, url, backNum) }, duration) : _navTo(openType, url, backNum);
};
