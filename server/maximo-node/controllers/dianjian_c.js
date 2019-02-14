const code = require('../configs/code');
//对应的数据处理模型
const dianjianModel = require('../models/dianjian_m');
const {jqlite } = require('chestnut-utils');
const Base64 = require('js-base64').Base64;

module.exports = {
    async newslist(ctx){
        const rs = await dianjianModel.getDjList(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getWorkOrder(ctx){
        const rs = await dianjianModel.getWorkOrder(ctx);
        if(rs){

            let finalOut = {};
            finalOut.wonum = rs.workorder.wonum;
            finalOut.description = rs.workorder.description;
            finalOut.location = rs.workorder.locations.location;
            finalOut.locdescription = rs.workorder.locations.description;
            finalOut.assetnum = rs.workorder.asset.assetnum;
            finalOut.assetdescription = rs.workorder.asset.description;
            var wcarr = [];
            rs.workorder.woactivity.forEach(e=>{
                var $ = jqlite(e.description_longdescription);
                let srcBase64 = Base64.encode($('img').attr('src'));
                wcarr.push({
                    description:e.description,
                    curdocurl:e.curdocurl,
                    TASKID:e.taskid,
                    WONUM:e.wonum,
                    DESCRIPTION_LONGDESCRIPTION:'/dianjian/downloadimg?imgsrc='+srcBase64,
                    POINTNUM:e.pointnum
                })
            })
            finalOut.woactivity = wcarr;
            ctx.body = finalOut;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async djsub(ctx){
        const rs = await dianjianModel.djsub(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async download(ctx){//下载图片
        const rs = await dianjianModel.download(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
    
};