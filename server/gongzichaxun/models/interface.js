const DB = require('../utils/DB'), db = DB.getConnection();

module.exports = {
    async recordQuery(ctx){
        let {date,gonghao} = ctx.request.body;
        console.log("gonghao>>>>"+gonghao)
        let sql = `select 薪资期间,姓名,dbo.esfuncdecodewcu(基本工资) as 基本工资,dbo.esfuncdecodewcu(月度奖金) as 月度奖金,dbo.esfuncdecodewcu(保留工资) as 保留工资,dbo.esfuncdecodewcu(明星员工嘉奖) as 明星员工嘉奖,dbo.esfuncdecodewcu(班组长津贴) as 班组长津贴,dbo.esfuncdecodewcu(\"固定薪资补发\\扣\") as 固定薪资补发丶扣,dbo.esfuncdecodewcu(加班费) as 加班费,dbo.esfuncdecodewcu(中夜班费) as 中夜班费,dbo.esfuncdecodewcu(补发小计) as 补发小计,dbo.esfuncdecodewcu(骨干津贴) as 骨干津贴,dbo.esfuncdecodewcu(全勤奖) as 全勤奖,dbo.esfuncdecodewcu(团队效率奖) as 团队效率奖,dbo.esfuncdecodewcu(工作质量奖) as 工作质量奖,dbo.esfuncdecodewcu(保留项目) as 保留项目,dbo.esfuncdecodewcu(房贴实发) as 房贴实发,dbo.esfuncdecodewcu(税后补发) as 税后补发,dbo.esfuncdecodewcu(独生子女费) as 独生子女费,dbo.esfuncdecodewcu(特殊津贴合计) as 特殊津贴合计,dbo.esfuncdecodewcu(应发工资) as 应发工资,dbo.esfuncdecodewcu(假期扣款) as 假期扣款,dbo.esfuncdecodewcu(欠班扣款) as 欠班扣款,dbo.esfuncdecodewcu(病假扣款) as 病假扣款,dbo.esfuncdecodewcu(公假扣款) as 公假扣款,dbo.esfuncdecodewcu(养老金扣款) as 养老金扣款,dbo.esfuncdecodewcu(医疗金扣款) as 医疗金扣款,dbo.esfuncdecodewcu(失业金扣款) as 失业金扣款,dbo.esfuncdecodewcu(公积金扣款) as 公积金扣款,dbo.esfuncdecodewcu(会费扣款) as 会费扣款,dbo.esfuncdecodewcu(党费) as 党费,dbo.esfuncdecodewcu(其他扣款) as 其他扣款,dbo.esfuncdecodewcu(固定扣款) as 固定扣款,dbo.esfuncdecodewcu(税前扣款) as 税前扣款,dbo.esfuncdecodewcu(个调税) as 个调税,dbo.esfuncdecodewcu(年金个人缴费) as 年金个人缴费,dbo.esfuncdecodewcu(医药费扣) as 医药费扣,dbo.esfuncdecodewcu(税后扣款) as 税后扣款,dbo.esfuncdecodewcu(应扣款项) as 应扣款项,dbo.esfuncdecodewcu(饭费扣款) as 饭费扣款,dbo.esfuncdecodewcu(实得工资) as 实得工资,dbo.esfuncdecodewcu(补充公积金月缴) as 补充公积金月缴,dbo.esfuncdecodewcu(月年金企业记账额) as 月年金企业记账额 ,备注 as 备注 from SkyPayEmpAll_Interface_APP where 工号='${gonghao}'`;
        if(date != ""){
            sql+=` and 薪资期间='${date}'`;
        }
        
        sql+=" order by 薪资期间 desc";
        console.log(sql);
        let rs = await db.query(sql,[]);
        console.log(rs);
        let list = [],username="",currDate="";
        if(rs.recordset.length>0){
            for(let key in rs.recordset[0]){
                if(key=='姓名'){
                    username = rs.recordset[0][key];
                }else if(key=='薪资期间'){
                    currDate = rs.recordset[0][key];
                }else{
                    list.push({
                        name:key,
                        value:rs.recordset[0][key]
                    })
                }
                
            }
        }
        return {
            date_arr:rs.recordset.map(item=>{
                return item['薪资期间']
            }),
            list,
            username,
            currDate
        }
    }
};