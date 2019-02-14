/*
生成错误码的类
code.get(object|number)方法为生成统一响应体方法
当请求错误时，需要再configs/codes目录下配置json错误码文件，错误码文件中的错误码不能重复，一般按照数字前几位进行归类，使用code.get(errcode)获取该错误码对应的响应体
当请求成功时，需要将请求要返回的数据创建为一个对象obj，使用code.get(obj)获取数据的响应体，如果不需要返回数据，则可以直接使用空对象{}，不可以为空或者undefined
*/
const code = require('../configs/code');

const qingjiaModel = require('../models/qingjia');


module.exports = {
    async getDbList(ctx){
        const rs = await qingjiaModel.getDbList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiasearch(ctx){
        const rs = await qingjiaModel.qingjiasearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async faqi_qingjiasearch(ctx){
        const rs = await qingjiaModel.faqi_qingjiasearch(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiadetail(ctx){
        const rs = await qingjiaModel.qingjiadetail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiayiban(ctx){
        const rs = await qingjiaModel.qingjiayiban(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async AttachDownload(ctx){
        const rs = await qingjiaModel.AttachDownload(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiasubmit(ctx){
        const rs = await qingjiaModel.qingjiasubmit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiachoose(ctx){
        const rs = await qingjiaModel.qingjiachoose(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async qingjiahistory(ctx){
        const rs = await qingjiaModel.qingjiahistory(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getQingjianew(ctx){
        const rs = await qingjiaModel.getQingjianew(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async newqingjia(ctx){
        const rs = await qingjiaModel.newqingjia(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async addfile(ctx){
        const rs = await qingjiaModel.addfile(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
    
    
    
    

    
    
    
    
    
    
};