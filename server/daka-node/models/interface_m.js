const utils = require('chestnut-utils');
const config = require('../configs/config');
const dbConfig = config.database['mssql'];
const db = utils.db(dbConfig);
const moment = require('moment');//时间处理函数

module.exports = {
    async recordQuery(ctx){//查询员工打卡记录
        let {username,date} = ctx.request.body;
        if(date && date != ""){
            date = date.replace(/-/g,'');
        }else{
            date = moment().format('YYYYMMDD');
        }
        let sql = `SELECT convert(VARCHAR(20),[chg_time],120) as login_time,[are_name],emp_code,emp_name FROM [scm_main].[dbo].[vw_att_recordusedAPP] 
        where convert(VARCHAR(10),chg_time,112)= ? and emp_code= ? order by login_time asc;`;
        let rs = await db.query(sql, [date,username]);
        if(rs.error){
            return null;
        }else{
            let finalOut = {list:[],total:0};
            rs.recordset.forEach((e,i)=>{
                let pobj = {};
                pobj.login_time = e.login_time;
                pobj.are_name = e.are_name;
                finalOut.list.push(pobj);
            });
            finalOut.total = rs.recordset.length;
            return finalOut;
        }
    },
    async personQuery(ctx){
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