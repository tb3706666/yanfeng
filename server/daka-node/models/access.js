const utils = require('chestnut-utils');
const config = require('../configs/config');
const dbConfig = config.database['mssql'];
const db = utils.db(dbConfig);

module.exports = {
    async checklogin(ctx){
        let {username} = ctx.request.body;
        let sql = `SELECT [badge],[name],[repjobbadge],[repjob],[emptype],[emptypeid],[status] FROM [MOBILE].[dbo].[employee_interface]  where repjobbadge = ?  order by emptypeid,convert(int,badge)`,
        params = [username];
        let rs = await db.query(sql, params);
        if(rs.error){
            return null;
        }else{
            let finalOut = {list:[]};
            rs.recordset.forEach((e,i)=>{
                let pobj = {};
                pobj.badge = e.badge;
                pobj.name = e.name;
                finalOut.list.push(pobj);
            });

            return finalOut;
        }
    }
}