

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');

// 数据库操作工具类
const DB = require('../utils/DB'), db = DB.getConnection();

module.exports = {
    async getList(queryData){
        const { pageSize = 20, pageNum = 0 } = queryData;
        const rs = [];
        for(let i=0, len=pageSize;i<len;i++){
            rs.push({
                title: '标题'+(pageNum*pageSize+i)
            });
        }
        return {
            list: rs,
            pageSize,
            pageNum,
            total: 0
        };
    }
};