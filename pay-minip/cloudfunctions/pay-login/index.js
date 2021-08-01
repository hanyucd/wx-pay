// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

const userCollection = db.collection('pay-user'); // 用户集合实例

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  // console.log(wxContext)
  const _openid = wxContext.OPENID;
  const { userInfo } = event;

  // 判断用户是否存在
  const user = (await userCollection.where({ _openid }).limit(1).get()).data[0];
  // console.log(user);
  if (user) return { userId: user._id };

  // 添加用户到数据库
  const userId = (await userCollection.add({
    data: {
      ...userInfo,
      _openid,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
    }
  }))._id;
  // console.log(userId);
  
  return { userId };
}
