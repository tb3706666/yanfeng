
// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;

module.exports = {
    async submitLogin(ctx){
        let {username,password} = ctx.request.body;
        let rs = await fetch(`${OA_URL}/app/submitLogin`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                username:username,
                password:password,
                lang:'zh_CN',
                mailId:'',
                stepId:'',
                isapp:''
            }
        });
        let $ = jqlite(rs.body);
        let success_info = $("div[class='user'] h3").text().trim();
        let json = {};
        console.log("success_info>>>"+success_info)
        if(success_info == '欢迎您回来!'){
            json.result = 'success';
            json.user = $("div[class='user'] p[class='name'] span").text().trim().split('    ')[0].trim();
            json.name = $("div[class='user'] p[class='name'] span").text().trim().split('    ')[1]+$("div[class='user'] p[class='name'] span").text().trim().split('    ')[2];
            if(rs.body.indexOf("评奖信息维护")>-1){
                json.pingjiangFlag = "1"
            }else{
                json.pingjiangFlag = "0"
            }
            //获取待办流程数量，主页显示气泡提示
            let daibanUrl = `${OA_URL}/bizProp/griddatasInProc`;
            //获取代他人处理的流程数量，主页显示气泡提示
            let otherUrl = `${OA_URL}/bizPropProxy/griddatasInProc`;
            rs = await fetch(daibanUrl, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                form:{
                    page:1,
                    rows:20,
                    csf:'1',
                }
            });
            let daibanJson = JSON.parse(rs.body.trim())
            json.daibanNum = daibanJson.total;
            rs = await fetch(`${OA_URL}/bizPropProxy/inProcLst`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                form:{
                    P_FUNC_ID:"",
                    newAgain:1,
                    csf:1,
                }
            });
            rs = await fetch(otherUrl, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                form:{
                    page:1,
                    rows:20,
                    csf:'1',
                }
            });
            let otherJson = JSON.parse(rs.body.trim())
            json.otherNum = otherJson.total;
            ctx.session.userinfo = ctx.request.body;//添加session
        }else{
            json.result = 'failed';
            json.error_info = $("div[class='error_info'] p").text().trim();
        }
        return json;
    },
    async getcookie(ctx){
        return {
            cookie:ctx.request.header.cookie
        }
    }
};