const code = require('../configs/code');

// access对应的数据处理模型
const ewyfModel = require('../models/ewyf');
module.exports = {
    async ewyflist(ctx){
        const rs = await ewyfModel.ewyflist(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async ewyfquery(ctx){
        const rs = await ewyfModel.ewyfquery(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async ewyfdetail(ctx){
        const rs = await ewyfModel.ewyfdetail(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
}