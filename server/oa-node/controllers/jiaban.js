const code = require('../configs/code');

const jiabanModel = require('../models/jiaban');


module.exports = {
    async getDbList(ctx){
        const rs = await jiabanModel.getDbList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiabansearch(ctx){
        const rs = await jiabanModel.jiabansearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async faqi_jiabansearch(ctx){
        const rs = await jiabanModel.faqi_jiabansearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiabandetail(ctx){
        const rs = await jiabanModel.jiabandetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiabanyiban(ctx){
        const rs = await jiabanModel.jiabanyiban(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jiabansubmit(ctx){
        const rs = await jiabanModel.jiabansubmit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async newjiaban(ctx){
        const rs = await jiabanModel.newjiaban(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
    
    
    
    
    

    
    
    
    
    
    
};