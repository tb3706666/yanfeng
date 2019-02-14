const code = require('../configs/code');
// access对应的数据处理模型
const accessModel = require('../models/access');

module.exports = {
    async login(ctx){//登录校验用户合法性
        const rs = await accessModel.checklogin(ctx);
        if(rs){
            ctx.body = rs;
        }else{
            ctx.body = code.get(10000); 
        }
        
    }
    
};