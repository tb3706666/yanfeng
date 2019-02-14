
const code = require('../configs/code');

const lizhiModel = require('../models/lizhi');


module.exports = {
    async getDbList(ctx){
        const rs = await lizhiModel.getDbList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    async lizhisearch(ctx){
        const rs = await lizhiModel.lizhisearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    async lizhidetail(ctx){
        const rs = await lizhiModel.lizhidetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async lizhiyiban(ctx){
        const rs = await lizhiModel.lizhiyiban(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
    
};