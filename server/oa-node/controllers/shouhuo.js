const code = require('../configs/code');

const shouhuoModel = require('../models/shouhuo');
module.exports = {
    async cgshdlist(ctx){
        const rs = await shouhuoModel.cgshdlist(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async cgshddetail(ctx){
        const rs = await shouhuoModel.cgshddetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
}