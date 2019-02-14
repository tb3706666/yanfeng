const code = require('../configs/code');

const tongyongModel = require('../models/tongyong');


module.exports = {
    async tongyonglist(ctx){
        const rs = await tongyongModel.tongyonglist(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async tongyongquery(ctx){
        const rs = await tongyongModel.tongyongquery(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async tongyongdetail(ctx){
        const rs = await tongyongModel.tongyongdetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
    
}