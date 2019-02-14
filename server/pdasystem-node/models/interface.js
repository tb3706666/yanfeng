

const utils = require('chestnut-utils');
const config = require('../configs/config');
const moment = require('moment');
module.exports = {
    async isLists(ctx){
        let {username,session_DB,searchfont}=ctx.request.body;
        const db = utils.db(session_DB);
        let sql = `select * from user_TBL where userName = ?;`, params = [username];
        let rs = await db.query(sql, params);
        if(rs.error) return false;
        let department =  rs.recordset[0].department;
        sql = `select ID,department,shorterform, cast(remark as nvarchar(1000)) as remark from positionList_TBL where department = '${department}'`,params = [department];
        if(searchfont != ''){
            sql += ` and (shorterform like '%${searchfont}%' or remark like '%${searchfont}%')`;
            params.push(searchfont);
            params.push(searchfont);
        }
        sql += ` order by ID asc`;
        rs = await db.query(sql, []);
        // console.log(sql);
        // console.log(params)
        if(rs.error) return false;
        // console.log(rs);
        return {
            size:rs.recordset.length,
            list:rs.recordset.map(function(item){
                return {
                    id:item.ID,
                    department:item.department,
                    shorterform:item.shorterform,
                    remark:item.remark,
                }
            })
        }
    },
    async detail(ctx){
        let {username,session_DB,shorterform,searchfont}=ctx.request.body;
        let sql =`select ID,cast(sheetName as nvarchar(1000)) as sheetName,cast(sqlName as nvarchar(1000)) as sqlName,cast(sqlDataName as nvarchar(1000)) as sqlDataName,inspectionFrequency,localversion,lineversion,department,position,used,authority,createDate,finalDate,createPeople,updatePeople,updateTimer,cast(remark as nvarchar(1000)) as remark,controlled,finalInspectionTime,Bluetooth from sheetList_TBL where position = '${shorterform}'`;
        if(searchfont!=""){
            sql+=` and sheetName like '%${searchfont}%'`;
        }
        sql+=" order by ID asc";
        const db = utils.db(session_DB);
        let rs = await db.query(sql, []);
        console.log(sql);
        // console.log(params)
        if(rs.error) return false;
        console.log(rs)
        return {
            size:rs.recordset.length,
            list:rs.recordset.map(function(item){
                let temp ={};
                for(let key in item){
                    temp[key.toLowerCase()] = item[key];
                }
                return temp
            })
        }
    },
    async templates(ctx){
        let {sqlname,session_DB}=ctx.request.body;
        let sql1 = `select id,cast(position as nvarchar(1000)) as position,cast(content as nvarchar(1000)) as content,method from ${sqlname} order by id asc`;
        const db = utils.db(session_DB);
        let rs = await db.query(sql1, []);
        if(rs.error) return false;
        console.log(rs)
        return {
            size:rs.recordset.length,
            list:rs.recordset.map(function(item){
                let temp ={};
                for(let key in item){
                    temp[key.toLowerCase()] = item[key];
                }
                return temp
            })
        }
    },
    async inserts(ctx){
        let {username,session_DB,contentvalue,hidngcontent,hidng,sqldataname,sheetname,sqlname,department}=ctx.request.body;
        let nowtime = moment().format('YYYY-MM-DD HH:mm:ss');
        let sqlin1 = `insert into ${sqldataname} (inspectionMan,inspectionTime`;
        let contentvalueArray = contentvalue.split("_vvcontentvv_");
        for(let k=1;k<=contentvalueArray.length;k++){
            sqlin1+=",content"+k;
        }
        sqlin1+=") values (";
        sqlin1+="'"+username+"',";
        sqlin1+="'"+nowtime+"',";
        for(let j=0;j<contentvalueArray.length;j++){
            sqlin1+="'"+contentvalueArray[j]+"',";
        }
        sqlin1+=")";
        sqlin1 = sqlin1.substring(0, sqlin1.length-2)+")";
        console.log(sqlin1);
        const db = utils.db(session_DB);
        let rs = await db.query(sqlin1, []);
        console.log(rs);
        let looktableidsql=`select max(id) as maxid from ${sqldataname}`;
        console.log(looktableidsql);
        rs = await db.query(looktableidsql, []);
        console.log(rs);
        let tableid =  rs.recordset[0].maxid;
        let insert1 = `insert into inspection_record (inspectionMan,inspectionTime,department,sheetName,sqlName,sqlDataName) values ('${username}','${nowtime}','${department}','${sheetname}','${sqlname}','${sqldataname}')`;
        console.log(insert1)
        rs = await db.query(insert1, []);
        console.log(rs);
        if(hidng!=""){
            let hidngcontentArray = hidngcontent.split("_vvcontentvv_");
            let hidngArray = hidng.split("_vvcontentvv_");
            for(let j=0;j<hidngArray.length;j++){
                let sqlin2 = "insert into XJNGRecord_TBL (inspectionMan,inspectionTime,巡检内容,NG内容,表记录表名,表记录ID) values (";
                sqlin2+="'"+username+"',";
                sqlin2+="'"+nowtime+"',";
                sqlin2+="'"+hidngcontentArray[j]+"',";
                sqlin2+="'"+hidngArray[j]+"',";
                
                sqlin2+="'"+sqlname+"',";
                sqlin2+="'"+tableid+"'";
                
                sqlin2+=")";
                console.log("sqlin2="+sqlin2);
                rs = await db.query(sqlin2, []);
                console.log(rs);
            }
        }
        return {

        }
    }
};