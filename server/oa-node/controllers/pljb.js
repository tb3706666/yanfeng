
const code = require('../configs/code');

const pljbModel = require('../models/pljb');


module.exports = {
    async getDbList(ctx){
        const rs = await pljbModel.getDbList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    async jiaqiansearch(ctx){
        const rs = await pljbModel.jiaqiansearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    async jiaqiandetail(ctx){
        const rs = await pljbModel.jiaqiandetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiaqianyiban(ctx){
        const rs = await pljbModel.jiaqianyiban(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async listDeal(ctx){
        const rs = await pljbModel.listDeal(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
    
};