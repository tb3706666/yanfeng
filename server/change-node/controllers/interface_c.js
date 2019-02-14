const code = require('../configs/code');
//对应的数据处理模型
const interfaceModel = require('../models/interface_m');

module.exports = {
    async modelCodeQuery(ctx){
        const rs = await interfaceModel.modelCodeQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async configQuery(ctx){
        const rs = await interfaceModel.configQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async insertLog(ctx){
        const rs = await interfaceModel.insertLog(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
}