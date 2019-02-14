

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
        await fetch(`${HR_URL}/logout.aspx`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let rs  =await fetch(`${OA_URL}/ekp/logout.jsp`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        //  await fetch(`${OA_URL}/ekp`, {
        //     ctx: ctx,
        //     method: 'get',
        //     headers: {
        //         "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
        //     },
        // });
        
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
        // console.log(rs.body)
        //oa登陆结束,hr登陆开始
        rs  = await fetch(`${HR_URL}/Loginx.aspx?logout=1`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        $ = jqlite(rs.body);
        // let checkParams = {
        //     userid:username,
        //     pwd:password
        // };
        // $('input[type="hidden"]').each(function(){
        //     const $el = $(this);
        //     checkParams[$el.attr('name')] = $el.attr('value');
        // });
        let action = $('form').attr('action');
        let __VIEWSTATE = $("input[name='__VIEWSTATE']").val();
        let __VIEWSTATEGENERATOR = $("input[name='__VIEWSTATEGENERATOR']").val();
        let __EVENTVALIDATION = $("input[name='__EVENTVALIDATION']").val();
        let screenHeight = $("input[name='screenHeight']").val();
        let clientHeight = $("input[name='clientHeight']").val();
        let languagelist = ($("input[name='languagelist']").val()?$("input[name='languagelist']").val():'');
        let smquerydata = $("input[name='smquerydata']").val();
        let smauthreason = $("input[name='smauthreason']").val();
        let smagentname = $("input[name='smagentname']").val();
        let postpreservationdata = $("input[name='postpreservationdata']").val();
        let form = {
            ctl02:login,
            __VIEWSTATE:__VIEWSTATE,
            __VIEWSTATEGENERATOR:__VIEWSTATEGENERATOR,
            __EVENTVALIDATION:__EVENTVALIDATION,
            userid:username,
            pwd:password,
            screenHeight:screenHeight,
            clientHeight:clientHeight,
            languagelist:languagelist,
            USER:username,
            PASSWORD:password,
            target:"https://ae-hrbs.adient.com/YFJC_NEWAD/Loginxx.aspx",
            smquerydata:smquerydata,
            smauthreason:smauthreason,
            smagentname:smagentname,
            postpreservationdata:postpreservationdata
        };
        // console.log(form);
        if(action.indexOf('https')==-1){
            action = HR_URL+"/"+action;
        }
        console.log(action)
        rs  = await fetch(action, {
            ctx: ctx,
            method: 'post',
            form: form,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            cookies:{
                lgid:lgid 
            }
        });
        if(HR_URL.indexOf('https')>-1){
            action = HR_URL+'/Loginxx.aspx';
        }else{
            action = HR_URL+'/Portal/Home.aspx?isess=1';
        }
        rs  = await fetch(action, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        const hrstatus = rs.body.indexOf('Home.aspx')>-1
        ctx.session.userinfo = postData;//添加session
        return {
            oa_status:oastatus?'success':'fail',
            hr_status:hrstatus?'success':'fail',
        };
       
    },
    async getcookie(ctx){
        return {
            cookie:ctx.request.header.cookie
        }
    }
};