
const code = require('../configs/code');

const hrqueryModel = require('../models/hrquery');


module.exports = {
    async personnel(ctx){
        const rs = await hrqueryModel.personnel(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    async recordQuery(ctx){
        const rs = await hrqueryModel.recordQuery(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    }, 
    
};