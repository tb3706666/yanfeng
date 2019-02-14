

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;
module.exports = {
    async doLogin(ctx){
        const postData = ctx.request.body; // 获取post提交的数据
        const { username, password } = postData;
        await fetch(`${OA_URL}/ekp/logout.jsp`, {
            ctx: ctx,
            requestId: 'oa',
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });

        let rs  = await fetch(`${OA_URL}/ekp`, {
            ctx: ctx,
            requestId: 'oa',
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        
        const $ = jqlite(rs.body);
        let formAction = $('form[name="login_form"]').attr('action');
        rs = await fetch(`${OA_URL}/ekp/${formAction}`, {
            ctx: ctx,
            requestId: 'oa',
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                j_username:username,
                j_password:password,
                j_lang:"zh-CN"
            }
        });
        if(rs.error){
            return false;
        }
        const status = /location.href = '[^']+'/.test(rs.body);
        
        if(status){
            await fetch(`${OA_URL}${status}`, {
                ctx: ctx,
                requestId: 'oa',
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            console.log('登陆成功')
            ctx.session.userinfo = postData;//添加session
            return {
                oa_status:"success",
                hr_status:"success",
            };
        }else{
            console.log('登陆失败')
            return {
                oa_status:"false",
                hr_status:"success",
            };
        }
    },
    async getList(ctx){
       
        let imgFlag = "false";
        let { erweima }  = ctx.request.body;
        erweima = Base64.decode(erweima);
        if(erweima.includes("method=list")){
            imgFlag="list";
        }
        console.log(erweima)
        let rs = await fetch(erweima, {
            ctx: ctx,
            requestId: 'oa',
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        const $ = jqlite(rs.body);
        
        if(imgFlag=="list"){
            let tables = []; 
            $('table[id="List_ViewTable"] tr').filter(i=>i>0).each(function(index,e){
                let td2 = $(e).find('td').eq(1).text().trim();
                let td3 = $(e).find('td').eq(2).text().trim();
                let td4 = $(e).find('td').eq(3).text().trim();
                let td3href = $(e).find('td').eq(2).find('a').attr('onclick');
                let inputValue = $(e).find('td').eq(3).find('input').val();
                let td4href = $(e).find('td').eq(3).find('a').attr('onclick').replace(/getOutUr.*\)/,"getOutUrl('"+Base64.encode(inputValue)+"')");
                tables.push({
                    td2:td2,
                    td3:td3,
                    td4:td4,
                    td3href:td3href,
                    td4href:td4href,
                })
            })
            console.log('列表数量'+tables.length)
            return {
                "imgFlag":"list",
                "tables":tables
            }
        }else{
            const url1 = /function getFileName[\s\S]*?;/.exec(rs.body);
            if(url1&&url1[0]&&url1[0].includes('fileKeySufix')){
                imgFlag = 'true';
            }
            if(imgFlag=="false"){
                return {
                    "imgFlag":"false",
                    "fileName":$('div[class="attachment"] ul li strong').text(),
                    "fileHref":$('div[class="attachment"] ul li a').attr('href'),
                }
            }else{
                return {
                    "imgFlag":"true",
                    "fileName":$('div[class="attachment"] ul li strong').text(),
                    "fileHref":$('div[class="attachment"] ul li a').attr('href'),
                }
            }
        }
        
    },
    async download(ctx){
        let url = Base64.decode(ctx.query.url)
        console.log(`${OA_URL}${url}`)
        let rs = await fetch(`${OA_URL}${url}`, {
            ctx: ctx,
            requestId: 'oa',
            method: 'get',
            headers: {
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },function(){});
        return rs;

    },
    async getcookie(ctx){
        return {
            cookie:ctx.request.header.cookie
        }
    }
};