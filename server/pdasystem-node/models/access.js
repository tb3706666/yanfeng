

const utils = require('chestnut-utils');
const config = require('../configs/config');

module.exports = {
    async isExituser(ctx){
        let {username,password,session_DB}=ctx.request.body
        const dbConfig = config.database[session_DB];
        const db = utils.db(dbConfig);
        let sql = `select * from user_TBL where userName = ?;`, params = [username];
        let rs = await db.query(sql, params);
        if(rs.error) return false;
        let loginflag = "0",department='';//失败
        if(rs.recordset.length==0){
            loginflag = "0";
        }else{
            if(rs.recordset[0].userPassport === password){
                loginflag = "1";
                department = rs.recordset[0].department;
            }else{
                loginflag = "0";
            }
        }
        return {
            loginflag,
            department
        }
    }
};