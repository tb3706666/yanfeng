
const code = require('../configs/code');

const interfaceModel = require('../models/interface');


module.exports = {
    async list(ctx){
        const rs = await interfaceModel.list(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async queryList(ctx){
        const rs = await interfaceModel.queryList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async detail(ctx){
        const rs = await interfaceModel.detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async AttachDownload(ctx){
        const rs = await interfaceModel.AttachDownload(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getpeople(ctx){
        const rs = await interfaceModel.getpeople(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async set_recent_people(ctx){
        const rs = await interfaceModel.set_recent_people(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async oaSubmit(ctx){
        const rs = await interfaceModel.oaSubmit(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
};