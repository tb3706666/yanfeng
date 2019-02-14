/*
生成错误码的类
code.get(object|number)方法为生成统一响应体方法
当请求错误时，需要再configs/codes目录下配置json错误码文件，错误码文件中的错误码不能重复，一般按照数字前几位进行归类，使用code.get(errcode)获取该错误码对应的响应体
当请求成功时，需要将请求要返回的数据创建为一个对象obj，使用code.get(obj)获取数据的响应体，如果不需要返回数据，则可以直接使用空对象{}，不可以为空或者undefined
*/
const code = require('../configs/code');

// interface对应的数据处理模型
const interfaceModel = require('../models/interface');


module.exports = {
    async list(ctx){
        const rs = await interfaceModel.list(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async list_nextpage(ctx){
        const rs = await interfaceModel.list_nextpage(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async detail(ctx){
        const rs = await interfaceModel.detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async event(ctx){
        const rs = await interfaceModel.event(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async event2(ctx){
        const rs = await interfaceModel.event2(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async AttachDownload(ctx){
        const rs = await interfaceModel.AttachDownload(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async addevent2(ctx){
        const rs = await interfaceModel.addevent2(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async tree1(ctx){
        const rs = await interfaceModel.tree1(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
};