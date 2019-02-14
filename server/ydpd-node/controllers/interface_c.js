const code = require('../configs/code');
//对应的数据处理模型
const interfaceModel = require('../models/interface_m');

module.exports = {
    async getList(ctx){
        const rs = await interfaceModel.getList(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getDetail(ctx){
        const rs = await interfaceModel.getDetail(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async decodeSub(ctx){
        const rs = await interfaceModel.decodeSub(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async findNew(ctx){
        const rs = await interfaceModel.findNew(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
}