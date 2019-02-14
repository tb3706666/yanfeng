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
    async hlh_list(ctx){
        const rs = await interfaceModel.hlh_list(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_chaoqi_list(ctx){
        const rs = await interfaceModel.hlh_chaoqi_list(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_detail(ctx){
        const rs = await interfaceModel.hlh_detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_other_list(ctx){
        const rs = await interfaceModel.hlh_other_list(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_add(ctx){
        const rs = await interfaceModel.hlh_add(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async upload(ctx){
        const rs = await interfaceModel.upload(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async deleteAddt(ctx){
        const rs = await interfaceModel.deleteAddt(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async createSubmit(ctx){
        const rs = await interfaceModel.createSubmit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async search(ctx){
        const rs = await interfaceModel.search(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_query_init(ctx){
        const rs = await interfaceModel.hlh_query_init(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async griddatasInProc(ctx){
        const rs = await interfaceModel.griddatasInProc(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async hlh_query_detail(ctx){
        const rs = await interfaceModel.hlh_query_detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000);
        }
    },
    async download(ctx){
        const rs = await interfaceModel.download(ctx);
        if(rs){
            ctx.body = rs; 
            // ctx.body = code.get(10001); 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_deal_init(ctx){
        const rs = await interfaceModel.hlh_deal_init(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async SelectList(ctx){
        const rs = await interfaceModel.SelectList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_credit_init(ctx){
        const rs = await interfaceModel.hlh_credit_init(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async jifenList(ctx){
        const rs = await interfaceModel.jifenList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async buildOrgSelectedTree(ctx){
        const rs = await interfaceModel.buildOrgSelectedTree(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async buildOrgSelectedTree1(ctx){
        const rs = await interfaceModel.buildOrgSelectedTree1(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async oaSubmit(ctx){
        const rs = await interfaceModel.oaSubmit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_edit(ctx){
        const rs = await interfaceModel.hlh_edit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_eval_init(ctx){
        const rs = await interfaceModel.hlh_eval_init(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async EvalList(ctx){
        const rs = await interfaceModel.EvalList(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_eval_detail(ctx){
        const rs = await interfaceModel.hlh_eval_detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async toGrantSubmit(ctx){
        const rs = await interfaceModel.toGrantSubmit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getSects(ctx){
        const rs = await interfaceModel.getSects(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async getEmpInfos(ctx){
        const rs = await interfaceModel.getEmpInfos(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_other_detail(ctx){
        const rs = await interfaceModel.hlh_other_detail(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    async hlh_other_edit(ctx){
        const rs = await interfaceModel.hlh_other_edit(ctx);
        if(rs){
            ctx.body = rs; 
        }else{
            ctx.body = code.get(10000); 
        }
    },
    
};