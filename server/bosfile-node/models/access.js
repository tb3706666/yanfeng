

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL,hr:HR_URL } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;
module.exports = {
    async doLogin(ctx){
        const postData = ctx.request.body; // 获取post提交的数据
        const { username, password, lan } = postData;
        let j_lang = '',lgid ='',login;
        if(lan=="ch"){
            j_lang="zh-CN";
            login="登录";
            lgid='2052';
        }else{
            j_lang="en-US";
            login="Login";
            lgid='1033';
        }
        let rs  =await fetch(`${OA_URL}/ekp/logout.jsp`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let formAction = $('form[name="login_form"]').attr('action');
        rs = await fetch(`${OA_URL}/ekp/${formAction}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                j_username:username,
                j_password:password,
                j_lang:j_lang
            }
        });
        if(rs.error){
            return false;
        }
        let temp = await fetch(`${OA_URL}/ekp/sys/portal/page.jsp`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        // console.log(temp.body.trim())
        const oastatus = /location.href = '[^']+'/.test(rs.body);
        console.log("oa登陆："+oastatus);
        ctx.session.userinfo = postData;//添加session
        return {
            oa_status:oastatus?'success':'fail',
        };
       
    },
    async getcookie(ctx){
        return {
            cookie:ctx.request.header.cookie
        }
    }
};