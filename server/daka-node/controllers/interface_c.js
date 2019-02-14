const code = require('../configs/code');
// access对应的数据处理模型
const interfaceModel = require('../models/interface_m');

module.exports = {
    async recordQuery(ctx){
        const rs = await interfaceModel.recordQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
        
    },
    async personQuery(ctx){
        const rs = await interfaceModel.personQuery(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
    
};