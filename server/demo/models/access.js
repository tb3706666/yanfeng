

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');

// 数据库操作工具类
const DB = require('../utils/DB'), db = DB.getConnection();

module.exports = {
    async doLogin(postData){
        const { username, password } = postData;
        if(username && password){
            return true;
        }else{
            return false;
        }
    }
};