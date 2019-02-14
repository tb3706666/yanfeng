const code = require('../configs/code');
//对应的数据处理模型
const yufangModel = require('../models/yufang_m');

module.exports = {
    async getYfList(ctx){
        const rs = await yufangModel.getYfList(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async yfsub(ctx){
        const rs = await yufangModel.yfsub(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
    }
}