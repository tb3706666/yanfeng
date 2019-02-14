

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL,hr:HR_URL } = require('../configs/config').systemPath;
const utils = require('chestnut-utils');
const config = require('../configs/config');
var moment = require('moment');
module.exports = {
    async personnel(ctx){
        let result = {};
        let rs1 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:'{"FuncName":"fm.WindowProcess.GetFramework"}{:ky->w{"Path":"1.1001.479","Parameters":{},"Data":{},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230012","Init":true,"CurrentForm":"","ParamHtml":"","Popup":true}'
        });
        
        let $ = jqlite(rs1.body);
        let base = [],sc = [],sd = [],kaoqin = [];
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(0).find('td').eq(1).text(),
            value:$("table[id='G_A1']").find('tr').eq(0).find('td').eq(2).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(1).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(1).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(2).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(2).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(3).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(3).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(4).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(4).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(5).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(5).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(6).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(6).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A1']").find('tr').eq(10).find('td').eq(0).text(),
            value:$("table[id='G_A1']").find('tr').eq(10).find('td').eq(1).find('span').eq(0).text(),
        });
        let src = rs1.body.match(/(\"Data\"[^}]*})/)[1];
        let rs2 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:`{"FuncName":"fm.WindowProcess.GetUpdateFramework"}{:ky->w{"Path":"1.1006.479","Parameters":{},"Data":{"A1":{"FMKey":"A1",${src}}},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230012","Init":true,"CurrentForm":"A2","ParamHtml":"","Popup":true,"WinType":205}`
        });
        $ = jqlite(rs2.body);
        base.push({
            key:$("table[id='G_A2']").find('tr').eq(3).find('td').eq(0).text(),
            value:$("table[id='G_A2']").find('tr').eq(3).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(0).text(),
            value:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(2).text(),
            value:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(3).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(2).text(),
            value:$("table[id='G_A2']").find('tr').eq(5).find('td').eq(3).find('span').eq(0).text(),
        });
        let src1 = rs2.body.match(/(\"Data\"[^}]*})/)[1];
        let rs3 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:`{"FuncName":"fm.WindowProcess.GetUpdateFramework"}{:ky->w{"Path":"1.1006.479","Parameters":{},"Data":{"A1":{"FMKey":"A1",${src1}}},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230012","Init":true,"CurrentForm":"A3","ParamHtml":"","Popup":true,"WinType":205}`
        });
        $ = jqlite(rs3.body);
        base.push({
            key:$("table[id='G_A3']").find('tr').eq(5).find('td').eq(0).text(),
            value:$("table[id='G_A3']").find('tr').eq(5).find('td').eq(1).find('span').eq(0).text(),
        });
        base.push({
            key:$("table[id='G_A3']").find('tr').eq(6).find('td').eq(0).text(),
            value:$("table[id='G_A3']").find('tr').eq(6).find('td').eq(1).find('span').eq(0).text(),
        });
        let rs4 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:`{"FuncName":"fm.WindowProcess.GetUpdateFramework"}{:ky->w{"Path":"1.1006.479","Parameters":{},"Data":{"A1":{"FMKey":"A1",${src1}}},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230012","Init":true,"CurrentForm":"B21","ParamHtml":"","Popup":true,"WinType":205}`
        });
        $ = jqlite(rs4.body);
        sc.push({
            key:$("table[id='G_B21']").find('tr').eq(1).find('td').eq(0).text(),
            value:$("table[id='G_B21']").find('tr').eq(1).find('td').eq(1).find('span').eq(0).text(),
        });
        sc.push({
            key:$("table[id='G_B21']").find('tr').eq(2).find('td').eq(0).text(),
            value:$("table[id='G_B21']").find('tr').eq(2).find('td').eq(1).find('span').eq(0).text(),
        });
        sc.push({
            key:$("table[id='G_B21']").find('tr').eq(3).find('td').eq(0).text(),
            value:$("table[id='G_B21']").find('tr').eq(3).find('td').eq(1).find('span').eq(0).text(),
        });
        sc.push({
            key:$("table[id='G_B21']").find('tr').eq(3).find('td').eq(2).text(),
            value:$("table[id='G_B21']").find('tr').eq(3).find('td').eq(3).find('span').eq(0).text(),
        });
        let rs5 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:`{"FuncName":"fm.WindowProcess.GetFramework"}{:ky->w{"Path":"1.1001.490","Parameters":{},"Data":{},"OperaParam":{},"Width":1683,"Height":745,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/AjaxJSONProcess.aspx/Window/Window.aspx?wind=230016","Init":true,"CurrentForm":"","ParamHtml":"","Popup":true}`
        });
        $ = jqlite(rs5.body);
        $('table[id="G_A"] tr').each(function(index,e){
            sd.push({
                fdnj:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(6).find('span').eq(0).text(),
                fl:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(7).find('span').eq(0).text(),
                tz:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(9).find('span').eq(0).text(),
                ysynj:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(10).find('span').eq(0).text(),
                synj:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(11).find('span').eq(0).text(),
                a1:$(e).find('td').eq(6).text(),
                a2:$(e).find('td').eq(7).text(),
                a3:$(e).find('td').eq(9).text(),
                a4:$(e).find('td').eq(10).text(),
                a5:$(e).find('td').eq(11).text(),
                bnfl:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(8).find('span').eq(0).text(),
                syz:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(12).find('span').eq(0).text(),
                nd:$('table[id="fixRHeadTable_A"] thead').find('tr').eq(1).find('th').eq(0).find('span').eq(0).text(),
                countbnfl:$(e).find('td').eq(8).text(),
                countsyz:$(e).find('td').eq(12).text(),
                countnd:$(e).find('td').eq(0).text(),
            });
        });
        let rs6 = await fetch(`${HR_URL}/AjaxJSONProcess.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:`{"FuncName":"fm.WindowProcess.GetFramework"}{:ky->w{"Path":"1.1001.553","Parameters":{},"Data":{},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230019","Init":true,"CurrentForm":"","ParamHtml":"","Popup":true}`
        });
        $ = jqlite(rs6.body);
        $("table[id='gridform3208_G1'] tr[id]").each(function(i,e){
            kaoqin.push({
                G1__0_SYSTEM_TIME:$(e).find('td').eq(0).find('div').eq(0).find('span').eq(0).text(),
                G1__0_BADGE:$(e).find('td').eq(1).find('div').eq(0).find('span').eq(0).text(),
                G1__0_NAME:$(e).find('td').eq(2).find('div').eq(0).find('span').eq(0).text(),
                G1__0_TERM:$(e).find('td').eq(3).find('div').eq(0).find('span').eq(0).text(),
                G1__0_TYPE_NAME:$(e).find('td').eq(4).find('div').eq(0).find('span').eq(0).text(),
                G1__0_FTIME:$(e).find('td').eq(5).find('div').eq(0).find('span').eq(0).text(),
                G1__0_TTIME:$(e).find('td').eq(6).find('div').eq(0).find('span').eq(0).text(),
                G1__0_LOST_WORKHOURS:$(e).find('td').eq(7).find('div').eq(0).find('span').eq(0).text(),
                G1__0_DATAFROM:$(e).find('td').eq(8).find('div').eq(0).find('span').eq(0).text(),
                G1__0_DATATO:$(e).find('td').eq(9).find('div').eq(0).find('span').eq(0).text(),
                G1__0_ACTUAL_START_TIME:$(e).find('td').eq(10).find('div').eq(0).find('span').eq(0).text(),
                G1__0_ACTUAL_END_TIME:$(e).find('td').eq(11).find('div').eq(0).find('span').eq(0).text(),
            });
        });
        result.toast = $("span[id='A3__0_TITLE']").html().replace(/<a.*?>/g, "<a>");
        result.base = base;
        result.sc = sc;
        result.sd = sd;
        result.kaoqin = kaoqin;
        
        return result;
    },
    async recordQuery(ctx){
        const dbConfig = config.database['mssql'];
        const db = utils.db(dbConfig);
        let {username,date} = ctx.request.body;
        if(date == ''){
            date = moment().format('YYYYMMDD')
        }else{
            date = date.replace(/-/g,"")
        }
        let sql = `SELECT convert(VARCHAR(20),[chg_time],120) as login_time,[are_name],emp_code,emp_name FROM [scm_main].[dbo].[vw_att_recordused] where convert(VARCHAR(10),chg_time,112)= ? and emp_code= ? order by login_time asc;`, params = [date,username];
        let rs = await db.query(sql, params);
        // console.log(rs.recordset);
        if(rs.error) return false;
        return {
            list:rs.recordset,
            total:rs.recordset.length,
        }
    }
};