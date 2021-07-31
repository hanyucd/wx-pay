const { wx } = require("../../../pay-server/config")

/**
 * moduleName 存在，就是按照模块存储
 */
module.exports = {
  /**
   * 存储数据
   * @param {*} storageKey 
   * @param {*} storageValue
   * @param {*} moduleName 模块名称
   * { userInfo : { userId: 123, userName: 'miniapp' } }
   */
  setItemStorage: (storageKey, storageValue, moduleName) => {
    if (!moduleName) return wx.setStorageSync(storageKey, storageValue);

    let moduleInfo = this.getItemStorage(moduleName);
    moduleInfo[storageKey] = storageValue;
    wx.setStorageSync(moduleName, moduleInfo);
  },
  /**
   * 获取数据
   * @param {*} key
   * @param {*} moduleName 模块名称
   */
  getItemStorage: (storageKey, moduleName) => {
    if (!moduleName) return wx.getStorageSync(storageKey);

    // 获取模块对象
    const storageVal = this.getItemStorage(moduleName);
    // 如果有对应的key，取值
    if (storageVal) return storageVal[storageKey];

    return '';
  },
  /**
   * 清除指定数据 或 清除所有数据
   * @param {*} storageKey 删除对应key值数据
   */
  clearStorage: storageKey => {
    storageKey ? wx.removeStorageSync(storageKey) : wx.clearStorageSync();
  }
}
