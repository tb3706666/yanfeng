const code = require('../configs/code');
//对应的数据处理模型
const ghzhangModel = require('../models/guzhang_m');

module.exports = {
    async getGzList(ctx){
        const rs = await ghzhangModel.getGzList(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async zichanQuery(ctx){
        const rs = await ghzhangModel.zichanQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async weizhiQuery(ctx){
        const rs = await ghzhangModel.weizhiQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getGzms(ctx){
        const rs = await ghzhangModel.getGzms(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async gzSub(ctx){
        const rs = await ghzhangModel.gzSub(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async gzSubStatus(ctx){
        const rs = await ghzhangModel.gzSubStatus(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async newgd(ctx){
        const rs = await ghzhangModel.newgd(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
    
}