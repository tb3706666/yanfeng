const utils = require('chestnut-utils');
const config = require('../configs/config');
const dbConfig = config.database['mssql'];
const db = utils.db(dbConfig);
const {insertTable:insertTable} = require('../configs/config').systemPath;
const moment = require('moment');//时间处理函数

module.exports = {
    async modelCodeQuery(ctx){//查询车型配置
        let {carNo} = ctx.request.body;
        let sql = `SELECT TOP 1 [serial_number],[csn],[model_code],[type_name],[kpsn],[car_no] FROM [MOBILE].[dbo].[YTJIT_INFO_NORTH]  where car_no= ?`;
        let rs = await db.query(sql, [carNo.trim()]);
        if(rs.error){
            return null;
        }else{
            if(rs.recordset.length > 0){
                return rs.recordset[0].model_code;
            }else{
                return 'null';
            }
        }
    },
    async configQuery(ctx){
        let {texts} = ctx.request.body;
        let sql = `SELECT TOP 1 [serial_number],[csn],[model_code],[type_name],[kpsn],[car_no] FROM [MOBILE].[dbo].[YTJIT_INFO_NORTH]  where car_no= ? or kpsn = ? or csn = ?`;
        let rs = await db.query(sql, [texts.trim(),texts.trim(),texts.trim()]);
        if(rs.error){
            return null;
        }else{
            if(rs.recordset.length > 0){
                return rs.recordset[0].model_code;
            }else{
                return 'null';
            }
        }
    },
    async insertLog(ctx){
        let {ma1flag,ma2flag,username} = ctx.request.body,
        begin = moment().format('YYYY-MM-DD HH:mm:ss');
        let sql = `INSERT INTO ${insertTable} (OLD_NUMBER,NEW_NUMBER,OPER_ID,OPER_DATE) VALUES (?,?,?,?)`;
        let rs = await db.query(sql, [ma1flag.trim(),ma2flag.trim(),username.trim(),begin]);
        if(rs.error){
            return null;
        }else{
            if(rs.rowsAffected.length > 0 && rs.rowsAffected[0] == 1){

                return '1';
            }else{
                return 'null';
            }
        }
    }
}