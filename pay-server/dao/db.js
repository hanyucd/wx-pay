const MongoClient = require('mongodb').MongoClient;
const mongodburl = 'mongodb://127.0.0.1:27017/pay-wx'; // 数据库名: pay-wx
const commonUtil = require('../utils');

/**
 * 连接数据库
 * @params callback
 *         dbase 操作数据库的表
 *         db 关闭打开数据库
 */
const _connect = callback => {
  MongoClient.connect(mongodburl, (err, db) => { 
    if (err) throw err;
    let dbase = db.db('pay-wx');
    callback(dbase, db);
  });
}

/**
 * 查询数据
 * @param data 查询的条件
 * @param table 要查询的表
 */
exports.dbQuery = (data, table) => {
  return new Promise((resolve, reject) => {
    _connect((dbase, db) => { 
      // 连接数据库，根据 data 条件，查询 table 中符合条件的数据，返回一个数组，查询错误抛出错误
      dbase.collection(table).find(data).toArray((err, res) => { 
        if (err) throw err;
        db.close(); // 关闭数据库
        resolve(commonUtil.resSuccess(res || []));
      });
    });
  });
}

/**
 * 插入数据
 * @param data 插入的数据
 * @param table 要操作的表
 */
 exports.dbInsert = (data, table) => {
  return new Promise((resolve, reject) => {
    _connect((dbase, db) => { 
      // 连接数据库，将 data 数据插入 table 中，返回一个数组，查询错误抛出错误
      dbase.collection(table).insertOne(data, (err, res) => { 
        if (err) throw err;
        db.close(); // 关闭数据库
        resolve(commonUtil.resSuccess(res || []));
      });
    });
  });
 }
