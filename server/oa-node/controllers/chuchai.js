const code = require('../configs/code');

const chuchaiModel = require('../models/chuchai');
module.exports = {
    async chuchailist(ctx){
        const rs = await chuchaiModel.chuchailist(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chuchaiquery(ctx){
        const rs = await chuchaiModel.chuchaiquery(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chuchaidetail(ctx){
        const rs = await chuchaiModel.chuchaidetail(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async AttachDownload(ctx){
        const rs = await chuchaiModel.AttachDownload(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async addfile(ctx){
        const rs = await chuchaiModel.addfile(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async oaSubmit(ctx){
        const rs = await chuchaiModel.oaSubmit(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getpeople(ctx){
        const rs = await chuchaiModel.getpeople(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async set_recent_people(ctx){
        const rs = await chuchaiModel.set_recent_people(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chuchaiAddInfo(ctx){
        const rs = await chuchaiModel.chuchaiAddInfo(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async sfjpcheckshow(ctx){
        const rs = await chuchaiModel.sfjpcheckshow(ctx);
        if(rs){
            ctx.body = rs.result; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async xingchengFile(ctx){
        const rs = await chuchaiModel.xingchengFile(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiaotongFile(ctx){
        const rs = await chuchaiModel.jiaotongFile(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async yijianFile(ctx){
        const rs = await chuchaiModel.yijianFile(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async selpeople(ctx){
        const rs = await chuchaiModel.selpeople(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async selpeople1(ctx){
        const rs = await chuchaiModel.selpeople1(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async selpeoplejipiao(ctx){
        const rs = await chuchaiModel.selpeoplejipiao(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chufajipiao(ctx){
        const rs = await chuchaiModel.chufajipiao(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chengbenzhongxin(ctx){
        const rs = await chuchaiModel.chengbenzhongxin(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async chuchaiSubmit(ctx){
        const rs = await chuchaiModel.chuchaiSubmit(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
}