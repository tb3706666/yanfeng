
// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL,ip:OA_IP } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;

module.exports = {
    async list(ctx){
        let rs = await fetch(`${OA_URL}/wd/Home/Index.rails`, {
            ctx: ctx,
            followRedirect :false,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        rs = await fetch(`${OA_URL}/ss/Dashboard/OpenHomeDashboard.rails?id=c2492b87-2b72-4068-8983-0e1e2a2e6a15`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let list = JSON.parse(rs.body.match(/\"gadgets\":([^*]*])/)[1]);
        let item1,item2;
        for(let i=0;i<list.length;i++){
            if(list[i].title.indexOf('我创建的事件及请求')>-1){
                item1 = list[i].url;
                item2 = list[i].requestToken;
            }
        }
        let url1 =`${OA_URL}/ss/${item1}&dashboard_id=c2492b87-2b72-4068-8983-0e1e2a2e6a15&request_token=${item2}`
        rs = await fetch(url1, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)",
                "X-Prototype-Version":"1.7",
                "X-Requested-With":"XMLHttpRequest",
            },
        });
        let $ = jqlite(rs.body);
        let fenlei = [];
        $("tbody[class='listBody'] tr").each((i,e)=>{
            let params = JSON.parse($(e).attr("params"));

            fenlei.push({
                url:params.key,
                id:$(e).find("td").eq(0).text(),
                title:$(e).find("td").eq(1).text(),
                time:$(e).find("td").eq(2).text(),
                status:$(e).find("td").eq(3).text(),
                name:$(e).find("td").eq(4).text(),
                result:$(e).find("td").eq(5).text(),
                lasttime:$(e).find("td").eq(6).text(),
            });
        })
        let ye1="0";
        let ye2="0";  
        let ye =  $("input[class='textField pagingText']").attr('watermark');
        if(ye!=''){
            ye1=ye.split("/")[0];
            ye2=ye.split("/")[1];
        }
        return {
            fenlei,
            ye1,
            ye2
        }
    },
    async list_nextpage(ctx){
        // let rs = await fetch(`${OA_URL}/ss/Dashboard/OpenHomeDashboard.rails?id=c2492b87-2b72-4068-8983-0e1e2a2e6a15`, {
        //     ctx: ctx,
        //     method: 'get',
        //     headers: {
        //         "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
        //     },
        // });
        // let list = JSON.parse(rs.body.match(/\"gadgets\":([^*]*])/)[1]);
        // console.log(list);
        // let item1,item2;
        // for(let i=0;i<list.length;i++){
        //     if(list[i].title.indexOf('我创建的事件及请求')>-1){
        //         item1 = list[i].url;
        //         item2 = list[i].requestToken;
        //     }
        // }
        // let url1 =`${OA_URL}/ss/query/modifyGadgetList.rails?class_name=IncidentManagement.Incident&page_size=15&attributes=Id%3AID%2CTitle%2CCreationDate%2CStatus.Title%3A%E7%8A%B6%E6%80%81%2CLatestAssignment.User.Title%3A%E6%9C%80%E6%96%B0%E5%88%86%E9%85%8D%E5%B7%A5%E7%A8%8B%E5%B8%88%2CResponseLevel.Name%2C_MinutesToBreach%3A%E5%89%A9%E4%BD%99%E8%A7%A3%E5%86%B3%E6%97%B6%E9%97%B4&sort_by=Id&chart_type=None&id=NewGadget11-list&gadget_id=NewGadget11&hide_filters=True&query_changed=False&enable_launch=True&is_group_drill_down=False&cns=CreationUser-icu&request_token=${item2}&page=${ctx.request.body.ye}`
        let url1 =`${OA_URL}/ss/query/modifyGadgetList.rails?class_name=IncidentManagement.Incident&query=_%E6%88%91%E4%BB%A3%E4%BA%BA%E5%88%9B%E5%BB%BA%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%8F%8A%E8%AF%B7%E6%B1%822&page_size=15&page=${ctx.request.query.ye}&attributes=Id%3AID%2CTitle%2CCreationDate%2CStatus.Title%3A%E7%8A%B6%E6%80%81%2CLatestAssignment.User.Title%3A%E6%9C%80%E6%96%B0%E5%88%86%E9%85%8D%E5%B7%A5%E7%A8%8B%E5%B8%88%2CResponseLevel.Name%3A%E5%93%8D%E5%BA%94%E7%BA%A7%E5%88%AB%2C_MinutesToBreach%3A%E5%89%A9%E4%BD%99%E8%A7%A3%E5%86%B3%E6%97%B6%E9%97%B4&sort_by=Id%20desc%2CStatus.Title&chart_type=None&id=NewGadget14-list&gadget_id=NewGadget14&hide_filters=True&query_changed=False&enable_launch=True&is_group_drill_down=False&cns=CreationUser-icu&webdesk_query=True&localized_ch_data=en-GB%3DID%26colname%3DId%2Cen-GB%3DTitle%26colname%3DTitle%2Cen-GB%3DCreateDate%26colname%3DCreationDate%2Cen-GB%3Dstatus%26colname%3DStatus.Title%2Cen-GB%3DThe%2520latest%2520distribution%2520engineer%26colname%3DLatestAssignment.User.Title%2Cen-GB%3DSLA%26colname%3DResponseLevel.Name%2Cen-GB%3DResidual%2520Solving%2520Time%26colname%3D_MinutesToBreach&dashboard_id=c2492b87-2b72-4068-8983-0e1e2a2e6a15`
        
        rs = await fetch(url1, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)",
                "X-Prototype-Version":"1.7",
                "X-Requested-With":"XMLHttpRequest",
            },
        });
        let $ = jqlite(rs.body);
        let fenlei = [];
        $("tbody[class='listBody'] tr").each((i,e)=>{
            let params = JSON.parse($(e).attr("params"));

            fenlei.push({
                url:params.key,
                id:$(e).find("td").eq(0).text(),
                title:$(e).find("td").eq(1).text(),
                time:$(e).find("td").eq(2).text(),
                status:$(e).find("td").eq(3).text(),
                name:$(e).find("td").eq(4).text(),
                result:$(e).find("td").eq(5).text(),
                lasttime:$(e).find("td").eq(6).text(),
            });
        })
        let ye1="0";
        let ye2="0";  
        let ye =  $("input[class='textField pagingText']").attr('watermark');
        if(ye!=''){
            ye1=ye.split("/")[0];
            ye2=ye.split("/")[1];
        }
        return {
            fenlei,
            ye1,
            ye2
        }
    },
    async detail(ctx){
        let rs = await fetch(`${OA_URL}/ss/object/open.rails?class_name=IncidentManagement.Incident&key=${ctx.request.body.pageid}`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let list = [],listAtt=[],listparam=[];

        $("div[id='formBody'] div[class='groupBox'] div[class='groupBoxHeader']").each((i,e)=>{
            let listObj1 ={
                title:$(e).text().trim(),
            };
            let listsmall = [];
            $(e).next("div[class='groupBoxContent']").find("table tr td").each((i1,e1)=>{
                if($(e1).find("span").attr('id') && $(e1).find("span").attr('id').indexOf("IsClockStopped")>-1){

                }else if($(e1).find("span[style='display:none']").length>0){

                }else if($(e1).find("textarea[id='mainForm-Description']").length>0){
                    listsmall.push({
                        type:"webview",
                        value:Base64.encode($(e1).find("textarea[id='mainForm-Description']").text()),
                    });
                }else if($(e1).find("span[class='formLabel']").length>0){
                    listsmall.push({
                        type:"font",
                        value:$(e1).find("span[class='formLabel']").text(),
                    });
                }else if($(e1).find("span[class='dateTimePicker']").length>0){
                    listsmall.push({
                        type:"input",
                        value:$(e1).find("span[class='dateTimePicker'] input[type='hidden']").val(),
                    });
                }else if($(e1).find("input[name='_Attachment1']").length>0){
                    let listObj2 = {
                        type:"files",
                        filearr:[]
                    };
                    $(e1).find('a').each((i2,e2)=>{
                        listObj2.filearr.push({
                            text:$(e2).text().trim(),
                            href:$(e2).attr("href")
                        })
                    })
                    listsmall.push(listObj2);
                }else if($(e1).find("input").length>0){
                    listsmall.push({
                        type:"input",
                        value:$(e1).find("input[type!='hidden']").val(),
                    });
                }else if($(e1).find("textarea").length>0){
                    listsmall.push({
                        type:"textarea",
                        value:$(e1).find("textarea").text(),
                    });
                }
            })
            listObj1.listsmall = listsmall;
            list.push(listObj1);
        })

        return {
            list,
            listAtt,
            listparam
        }    
    },
    async event(ctx){
        //todo
        let rs = await fetch(`${OA_URL}/ss/object/create.rails?class_name=IncidentManagement.Incident&lifecycle_name=NewProcess11112&object_template_name=%E6%96%B0%E5%BB%BA%E6%A8%A1%E6%9D%BF0`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let result ={
            user:$("input[id='mainForm-RaiseUser2Display']").val(),
            dept:$("input[id='mainForm-_JCI部门工厂50']").val(),
            loginid:$("input[id='mainForm-Name44']").val(),
        };
        let list = [];
        $("div[id='formBody']").children("input[type='hidden']").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
        })
        $("div[id='mainForm-GroupBoxDesignerControl2'] table input[name][name!='_Attachment1']").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
        })
        $("div[id='mainForm-GroupBoxDesignerControl5'] table input[name]").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
        })
        result.list = list;
        return result;
    },
    async event2(ctx){
        let rs = await fetch(`${OA_URL}/ss/object/create.rails?class_name=IncidentManagement.Incident&lifecycle_name=NewProcess11112`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let result ={
            user:$("input[id='mainForm-RaiseUserTitleDisplay']").val(),
        };
        let list = [];
        $("div[id='formBody']").children("input[type='hidden']").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
           
        })
        $("div[id='mainForm-GroupBoxDesignerControl3'] table input[name][name!='_Attachment1']").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
            
        })
        $("div[id='mainForm-GroupBoxDesignerControl2'] table input[name][type='hidden'][name!='_JCI补单'][name!='_JCI信息安全事件'][name!='_MajorIncident'][name!='_JCI客户抱怨']").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
        })
        $("div[id='mainForm-GroupBoxDesignerControl1'] table input[name]").each((i,e)=>{
            list.push({
                name:$(e).attr("name"),
                value:$(e).val()
            });
        })
        result.list = list;
        return result;
    },
    async AttachDownload(ctx){
        let url = `${OA_IP}${Base64.decode(ctx.request.query.url)}`;
        // console.log(url);
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },function(){});
        return rs;
    },
    async addevent2(ctx){
        let formData = {
            _Attachment1:[]
        };
        for(let key in ctx.request.body){
            let temp = key.replace(/#/g,'.')
            formData[temp] = ctx.request.body[key];
        }
        ctx.request.files&&ctx.request.files.forEach(item=>{
            formData._Attachment1.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let rs = await fetch(`${OA_URL}/ss/object/save.rails`, {
            ctx: ctx,
            followRedirect :false,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        let $ = jqlite(rs.body);
        let status = ($("a").attr('href')&&$("a").attr('href')!='')?'success':'fail';
        return {
            status
        }
    },
    async tree1(ctx){
        let url = `${OA_URL}/ss/query/categoryTreeItems.rails?class_name=${ctx.request.body.lei}&key=&parent_lifecycle_name=NewProcess11112`;
        let values = ctx.request.body.values;
        if(values!=''){
            url+="&parent_node_key="+values;
        }
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        return JSON.parse(rs.body.trim())
    },
    
};