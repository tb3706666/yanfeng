
// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL,ip } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;

module.exports = {
    async initlogin(ctx){
        let rs = await fetch(`${OA_URL}/wd/Logon/Logon.rails`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        return {};
    },
    async logincheck(ctx){
        let rs = await fetch(`${OA_URL}/wd/Logon/Logon.rails`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
            },
            form:{
                Ecom_User_ID:ctx.request.body.username,
                Ecom_User_Password:ctx.request.body.password,
            },
        });
        let $ = jqlite(rs.body);
        let flag = $("span[id='errorLabel']").text();
        if(flag && flag!=''){
            return {flag}
        }

        $ = jqlite(rs.body);
        let result ={
            flag:"",
            users:$("span[id='currentGroupBox']").length>0?'currentGroupBox':''
        };
        ctx.session.userinfo = ctx.request.body;//添加session
        return result;
    },
    async getcookie(ctx){
        return {
            cookie:ctx.request.header.cookie
        }
    }
    
};