
// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;
module.exports = {
    async chuchailist(ctx){
        let pageNum = ctx.request.body.page;
        let url_param = "method=list&nodeType=TEMPLATE&q.fdTemplate=14153d1b693cea9edaf27a2488f8583c&q.mydoc=approval";
        if(pageNum!=""){
            url_param = url_param + "&pageno=" + pageNum + "&rowsize=15&q.s_raq=0.11948571410121078";
        }
        url_param = url_param + "&orderby=docCreateTime&ordertype=down&__seq=1467621323685&s_ajax=true";
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_index/kmReviewIndex.do?${url_param}`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let result = JSON.parse(rs.body.trim())
        // console.log(rs.body.trim());
        return {
            list:result.datas.map(function(item){
                return {
                    title:item[1].value,
                    no:item[2].value,
                    declPerson:item[3].value.match(/>(.*)</)[1],
                    createtime:item[4].value,
                    localstep:item[6].value.match(/title=\"(.*)\"/)[1],
                    fdId:item[0].value,
                }
            }),
            currentPage:result.page.currentPage,
            totalPage:Math.ceil(Number(result.page.totalSize)/Number(result.page.pageSize))
        };
    },
    async chuchaiquery(ctx){
        let {page:pageNum,subject:param_subject,billno:param_billno,status:param_status} = ctx.request.body;
        let url_param = "method=list&nodeType=TEMPLATE&q.fdTemplate=14153d1b693cea9edaf27a2488f8583c";
        if(param_subject!=''){
            url_param = url_param + "&q.docSubject=" + encodeURI(param_subject);
        }
        if(param_status!=''){
            url_param = url_param + "&q.docStatus=" + param_status;
        }
        if(param_billno!=''){
            url_param = url_param + "&q.fdNumber=" + param_billno;
        }
        if(pageNum!=''){
            url_param = url_param + "&pageno=" + pageNum + "&rowsize=15&q.s_raq=0.11948571410121078";
        }
        url_param = url_param + "&orderby=docCreateTime&ordertype=down&__seq=1467621323685&s_ajax=true";
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_index/kmReviewIndex.do?${url_param}`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let result = JSON.parse(rs.body.trim())
        // console.log(rs.body.trim());
        return {
            list:result.datas.map(function(item){
                return {
                    title:item[1].value,
                    no:item[2].value,
                    declPerson:item[3].value.match(/>(.*)</)[1],
                    createtime:item[4].value,
                    localstep:item[6].value.match(/title=\"(.*)\"/)[1],
                    fdId:item[0].value,
                }
            }),
            currentPage:result.page.currentPage,
            totalPage:Math.ceil(Number(result.page.totalSize)/Number(result.page.pageSize))
        };
    },
    async chuchaidetail(ctx){
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_main/kmReviewMain.do?method=view&fdId=${ctx.request.body.fdId}`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let rspObj = {};
        let lists_arr1 = [];//出差行程JSON数组
        
        let fdModelId = $("input[name = 'sysWfBusinessForm.fdModelId']").val();
        let fdModelName = $("input[name = 'sysWfBusinessForm.fdModelName']").val();
        let fdId = $("input[name = 'fdId']").val();
        let action =  $("form").attr('action');
        let shenPiUrl = `${OA_URL}/ekp/sys/workflow/sys_wf_audit_note/sysWfAuditNote.do?method=listNote&fdModelId=${fdId}&formBeanName=kmReviewMainForm`;
        rspObj.action = `${OA_URL}${action}?method=publishDraft&fdId=${fdModelId}&s_seq=1`;
        let cclb = $('form div table tbody').find('tr').eq(3).find('td').eq(1).text().trim().split('			')[0].trim();
        rspObj.cclb = cclb;
        if(cclb == "国外 International"){
       
        }else{
            rspObj.zt = $('form p').text().trim();
            rspObj.sqr = $('form div table tbody').find('tr').eq(2).find('td').eq(1).find('label').eq(0).text().trim();
            rspObj.sqrbm = $('form div table tbody').find('tr').eq(2).find('td').eq(5).find('div').eq(0).text().trim();
            rspObj.cckssj = $('form div table tbody').find('tr').eq(3).find('td').eq(3).find('div').eq(0).text().trim();
            rspObj.ccjssj = $('form div table tbody').find('tr').eq(3).find('td').eq(5).find('div').eq(0).text().trim();
            rspObj.ccmd = $('form div table tbody').find('tr').eq(6).find('td').eq(1).find('div').eq(0).text().trim();

            //出差行程开始
            $("table[label = '出差行程'] tr[kmss_iscontentrow = '1']").each((i,e)=>{
                if(cclb == "市内 Local"){
                    lists_arr1.push({
                        ccr:$(e).find('td').eq(1).find('label').eq(0).text().trim(),
                        cfsj:$(e).find('td').eq(4).find('div').eq(0).text().trim(),
                        ddsj:$(e).find('td').eq(5).find('div').eq(0).text().trim(),
                        cfd:$(e).find('td').eq(6).find('div').eq(0).text().trim(),
                        mdd:$(e).find('td').eq(8).find('div').eq(0).text().trim(),
                    });
                }else if(cclb == "新项目跨城市培训 Training across city"){
                    lists_arr1.push({
                        ccr:$(e).find('td').eq(1).find('label').eq(0).text().trim(),
                        cfsj:$(e).find('td').eq(4).find('div').eq(0).text().trim(),
                        ddsj:$(e).find('td').eq(5).find('div').eq(0).text().trim(),
                        cfd:$(e).find('td').eq(6).find('div').eq(0).text().trim(),
                        mdd:$(e).find('td').eq(8).find('div').eq(0).text().trim(),
                        ssqy:$(e).find('td').eq(10).text().trim(),
                    });
                }else{
                    lists_arr1.push({
                        ccr:$(e).find('td').eq(1).find('label').eq(0).text().trim(),
                        cfsj:$(e).find('td').eq(2).find('div').eq(0).text().trim(),
                        ddsj:$(e).find('td').eq(3).find('div').eq(0).text().trim(),
                        cfd:$(e).find('td').eq(6).find('div').eq(0).text().trim(),
                        mdd:$(e).find('td').eq(8).find('div').eq(0).text().trim(),
                        ssqy:$(e).find('td').eq(10).text().trim(),
                    });
                }
            });
            rspObj.xincheng = lists_arr1;

            //机票信息开始
            let listsjipiao = [];//机票数组
            $("table[id='TABLE_DL_fd_ticket_itinerary'] tr").filter((e,i)=>{
                return i>0 && $(e).attr('style')!='display:none' && $(e).attr('type') == 'templateRow' && $(e).find('td').eq(4).find('div').eq(0).text()!=''
            }).each((i,e)=>{
                listsjipiao.push({
                    td1:$(e).find('td').eq(0).text(),
                    td2:$(e).find('td').eq(1).text(),
                    td3:$(e).find('td').eq(2).text(),
                    td4:$(e).find('td').eq(3).text(),
                    td5:$(e).find('td').eq(4).text(),
                    td6:$(e).find('td').eq(5).text(),
                    td7:$(e).find('td').eq(6).text(),
                    td8:$(e).find('td').eq(7).text(),
                    td9:$(e).find('td').eq(8).text(),
                    td10:$(e).find('td').eq(9).text(),
                })
            })
            rspObj.listsjipiao = listsjipiao
            let jipiaoch = "false";
            
            if($('label:contains("需要预定机票") input[checked]').length!= 0){
                jipiaoch = "true";
            }
            rspObj.jipiaocheckbox = jipiaoch;	
            //附件json数组
            let fileArr = [];
            let fileCache1 = $("div[id = 'attachmentObject_fd_attachment_"+ fdModelId +"_content_div']").next('script').eq(0).html();
            let fileCache2 = $("div[id = 'attachmentObject_fd_3323b03ebb346a_"+ fdModelId +"_content_div']").next('script').eq(0).html();
            let regex1 = new RegExp(`attachmentObject_fd_attachment_${fdModelId}.addDoc\\('([^\\']*)',\\"([^\\"]*)\\",true,\\"[^\\"]*\\",\\"[^\\"]*\\",\\"([^\\"]*)\\"\\);`,"g")
            let regex2 = new RegExp(`attachmentObject_fd_3323b03ebb346a_${fdModelId}.addDoc\\('([^\\']*)',\\"([^\\"]*)\\",true,\\"[^\\"]*\\",\\"[^\\"]*\\",\\"([^\\"]*)\\"\\);`,"g")
            let match;
            while (match = regex1.exec(fileCache1)) {
                fileArr.push({
                    fileName:match[1],
                    fileId1:match[2],
                    fileId2:match[3],
                })
            }
            while (match = regex2.exec(fileCache2)) {
                fileArr.push({
                    fileName:match[1],
                    fileId1:match[2],
                    fileId2:match[3],
                })
            }
            rspObj.fileInfo=fileArr;

            let $tranProcessXMLCache = jqlite($("input[name = 'sysWfBusinessForm.fdTranProcessXML']").val());
            let $flowContentCache = jqlite($("input[name = 'sysWfBusinessForm.fdFlowContent']").val());
            let $buttonCache = jqlite($("input[name = 'sysWfBusinessForm.fdCurNodeXML']").val());
            let buttonArr = [];//设置操作按钮标志
		    let isPass = false;//通过 Approve
            let isRefuse = false;//驳回 Refuse
            let isCommission = false;//转办 Forward
            let isReturnCommunicate = false;//回复沟通 Communicate
            let isDrafterSubmit = false;//提交文档
            let isCommunicate = false;//沟通 Communicate
            let isCancelCommunicate = false;//取消沟通 Communicate
            let isAbandon = false;//废弃 Discard
            $buttonCache("operation[operationhandlertype='handler']").each((i,e)=>{
                let buttonValue = $(e).attr('id');
                if(buttonValue != "drafter_refuse_abandon"){
                    buttonArr.push({
                        buttonValue:buttonValue,
                        buttonName:$(e).attr('name'),
                        buttonType:$(e).attr('operationhandlertype'),
                    });
                    if(buttonValue==("handler_pass")){
                        isPass = true;
                    }else if(buttonValue==("handler_refuse")){
                        isRefuse = true;
                    }else if(buttonValue==("handler_commission")){
                        isCommission = true;
                        rspObj.isForward="1";
                    }else if(buttonValue==("handler_returnCommunicate")){
                        isReturnCommunicate = true;
                    }else if(buttonValue==("drafter_submit")){
                        isDrafterSubmit = true;
                    }else if(buttonValue==("handler_communicate")){
                        isCommunicate = true;
                        rspObj.isCommunicate="1";
                    }else if(buttonValue==("handler_cancelCommunicate")){
                        isCancelCommunicate = true;
                        rspObj.isCancelCommunicate="1";
                    }else if(buttonValue==("handler_abandon")){
                        isAbandon = true;
                    }
                }
            })
            rspObj.buttonInfo = buttonArr;
            //隐藏参数开始
            let hiddenArr = [];
            $("input[type = 'hidden']").each((i,e)=>{
                hiddenArr.push({
                    hiddenName:$(e).attr('name'),
                    hiddenValue:$(e).attr('value'),
                });
            })
            $("input[class = 'inputread_normal'][type != 'hidden']").each((i,e)=>{
                hiddenArr.push({
                    hiddenName:$(e).attr('name'),
                    hiddenValue:$(e).attr('value'),
                });
            })
            hiddenArr.push({
                hiddenName:"sysWfBusinessForm.fdNotifyLevel",
                hiddenValue:$("input[name='sysWfBusinessForm.fdNotifyLevel'][checked]").val()
            })
            rspObj.hidden = hiddenArr;
           
            let taskType = $buttonCache("task").last().attr('type');
            let taskId = $buttonCache("task").last().attr('id');
            let nodeId = $buttonCache("task").last().attr('nodeid');
            let processId = $("input[name = 'sysWfBusinessForm.fdProcessId']").val();

            //通过
            if(isPass){
                let passArr = [];
                rs = await fetch(`${OA_URL}/ekp/sys/lbpmservice/include/sysLbpmdata.jsp?processId=${processId}&modelName=${fdModelName}&nodeId=${nodeId}&nodeType=reviewNode&params=currNodeNextHandlersId:currNodeNextHandlersName:toRefuseThisNodeId:toRefuseThisHandlerIds:toRefuseThisHandlerNames:futureNodeId&s_ajax=true`, {
                    ctx: ctx,
                    method: 'get',
                    headers: {
                        "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                    },
                });
                let pass_json = {};
                if(rs.body.trim() != '{}'){
                    let passJSON = JSON.parse(rs.body.trim());
                    pass_json.nodehandleid = passJSON.toRefuseThisHandlerIds;
                    pass_json.nodeid = passJSON.toRefuseThisNodeId;
                    pass_json.nodeusername = passJSON.toRefuseThisHandlerNames;
                    pass_json.nodename = $tranProcessXMLCache(`node[targetid='${passJSON.toRefuseThisNodeId}']`).attr('targetname');

                }else{
                    let endnodeid = $flowContentCache(`line[startnodeid='${nodeId}']`).attr('endnodeid');
                    pass_json.nodeid = endnodeid;
                    pass_json.nodeusername = $flowContentCache(`autobranchnode[id='${endnodeid}']`).attr('name');
                    passArr.push(pass_json);
                }
                rspObj.pass = passArr;
                rspObj.isPass = "1";
            }
            //驳回
		    if(isRefuse){
                let refuseArr = [];
                rs = await fetch(`${OA_URL}/ekp/sys/lbpm/engine/jsonp.jsp?s_bean=lbpmRefuseRuleDataBean&processId=${processId}&nodeId=${nodeId}`, {
                    ctx: ctx,
                    method: 'get',
                    headers: {
                        "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                    },
                });
                let temp_arr = JSON.parse(rs.body.trim());
                temp_arr.forEach(element => {
                    refuseArr.push({
                        value:element,
                        text:$tranProcessXMLCache(`node[targetid='${element}']`).attr('targetname')
                    })
                });
                rspObj.refuse = refuseArr;
			    rspObj.isRefuse = "1";
            }
            //沟通
		    if(isCommunicate){
                let communicateArr = [];
                rs = await fetch(`${OA_URL}/ekp/sys/lbpmservice/include/sysLbpmdata.jsp?processId=${processId}&modelName=${fdModelName}&taskType=reviewWorkitem&taskId=${taskId}&params=relationWorkitemId:relationScope:relations:isMutiCommunicate&s_ajax=true`, {
                    ctx: ctx,
                    method: 'get',
                    headers: {
                        "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                    },
                });
                if(rs.body.trim() != '{}'){
                    let communicateJSON = JSON.parse(rs.body.trim());
                    let $relation = jqlite(communicateJSON.relations);
                    $relation('relations relation').each((i,e)=>{
                        
                        communicateArr.push({
                            srcId:e.attribs.srcid,
                            nodeId:e.attribs.nodeid,
                            nodeName:e.attribs.nodename,
                            itemId:e.attribs.itemid,
                            userId:e.attribs.userid,
                            userName:e.attribs.username,
                        });
                    })
                    rspObj.communicate = communicateArr;
                }
            }
            //添加session
            ctx.session.fdKey = $("input[name='fdId']").val();
            ctx.session.fdModelId = $("input[name='sysWfBusinessForm.fdModelId']").val();
            ctx.session.fdModelName = $("input[name='sysWfBusinessForm.fdModelName']").val();
            ctx.session.fdAuditNoteFdId = $("input[name='sysWfBusinessForm.fdAuditNoteFdId']").val();

            //提交流程时拼接json用 
            let submitjson_arr = [];
            let submitjson_json = {};
            submitjson_json.sj_taskId = taskId;
            submitjson_json.sj_processId = processId;
            submitjson_json.sj_activityType = taskType;
            rs = await fetch(`${OA_URL}/ekp/sys/lbpmservice/include/sysLbpmParamdata.jsp?m_Seq=0.781579652734095&processId=${processId}&paramName=notifyLevel&s_ajax=true`, {
                ctx: ctx,
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let notifyData = JSON.parse(rs.body.trim());
            submitjson_json.sj_notifyLevel = notifyData.notifyLevel;
            submitjson_arr.push(submitjson_json);
            rspObj.submitjson = submitjson_arr;
            //常用意见开始
            let selectArr = [];
            rs = await fetch(`${OA_URL}/ekp/sys/lbpmservice/support/lbpm_usage/lbpmUsage.do`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                formData:{
                    method:'getUsagesInfo'
                }
            });
            let selectCache = decodeURI(rs.body);
            if(selectCache == ""){

            }else if(selectCache.split("\n").length == 1){
                selectArr.push({
                    selectVale:selectCache
                })
            }else{
                selectCache.split("\n").map(item=>{
                    selectArr.push({
                        selectVale:item
                    })
                });

            }
            rspObj.select = selectArr;
            //审批记录Json数组
            let shenPiArr = [];
            rs = await fetch(`${OA_URL}/ekp/sys/lbpmservice/support/lbpm_audit_note/lbpmAuditNote.do?method=listNote&fdModelId=${fdModelId}&fdModelName=${fdModelName}&formBeanName=kmReviewMainForm`, {
                ctx: ctx,
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            $ = jqlite(rs.body);
            $("form table[class='tb_normal'] tr[id]").each((i,e)=>{
                // let temp = $(e).find('td').eq(4).find('table').eq(0).find('tr').eq(0).find('td').eq(0).html().trim().split('<br>').map(item=>{
                //     return {
                //         text:item
                //     }
                // });
                // console.log(temp)
                let fileCache = $("div[id = 'attachmentObject_"+ $(e).attr("id") +"_"+fdModelId +"_content_div']").next('script').eq(0).html();
                let regex = new RegExp(`.addDoc\\('([^\\']*)',\\"([^\\"]*)\\",true,\\"[^\\"]*\\",\\"[^\\"]*\\",\\"([^\\"]*)\\"\\);`,"g")
                let match;
                let fileArr = [];
                while (match = regex.exec(fileCache)) {
                    fileArr.push({
                        fileName:match[1],
                        fileId1:match[2],
                        fileId2:match[3],
                    })
                }
                let list_shenpi = {
                    sj:$(e).find('td').eq(0).text().trim(),
                    jdmc:$(e).find('td').eq(1).text().trim(),
                    czz:$(e).find('td').eq(2).text().trim(),
                    cz:$(e).find('td').eq(3).text().trim(),
                    //todo
                    clyj:[{
                        text:$(e).find('td').eq(4).find('table').eq(0).find('tr').eq(0).find('td').eq(0).text().trim()
                    }],
                    //todo审批流程里意见附件
                    file:fileArr
                };
                shenPiArr.push(list_shenpi);
            });
            rspObj.shenPiInfo = shenPiArr;

            //获取审批时提交附件参数
            rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=getuserkey`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                formData:{
                    md5:''
                }
            });
            $ = jqlite(rs.body);
            rspObj.userkey = $('userkey').text();
           
            // console.log(ctx.session)
        }
        return rspObj;
    },
    async AttachDownload(ctx){
        let rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=download&fdId=${ctx.query.fdId}`, {
            ctx: ctx,
            method: 'get',
            headers: {
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },function(){});
        return rs;
    },
    async addfile(ctx){
        console.log(ctx.request.files);
        const formData = {
            Upload:ctx.request.body.Upload,
            Filename:ctx.request.body.Filename,
            Filedata:[]
        }
        ctx.request.files.forEach(item=>{
            formData.Filedata.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let userkey = encodeURIComponent(ctx.request.query.userkey);
        let rs = await fetch(`${OA_URL}/ekp/sys/attachment/uploaderServlet?gettype=upload&userkey=${userkey}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        let $ = jqlite(rs.body);
        let file_key = $("filekey").text();
        console.log("file_key>>>>>>>>"+file_key);
        let file_name = encodeURI(ctx.request.body.Filename);
        let fdKey = ctx.session.fdKey;
        let fdModelId = ctx.session.fdModelId;
        let fdModelName = ctx.session.fdModelName;
        // console.log("url:"+`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${file_key}&filename=${file_name}&fdKey=${fdKey}&fdModelName=${fdModelName}&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=${fdModelId}`);
        rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${file_key}&filename=${file_name}&fdKey=${fdKey}&fdModelName=${fdModelName}&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=${fdModelId}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:{}
        });
        $ = jqlite(rs.body);
        console.log(rs.body);
        let rspObj  = {};
        let msg = $("msg").text();
        let attname =  $("attname").text();
        let attid =  $("attid").text();
        rspObj.info = msg;
        if(msg.indexOf("上传成功") > -1 || msg.indexOf("was successful") > -1){
            rspObj.flag = "success";
            rspObj.attid = attid;
            rspObj.attname = attname;
            rspObj.fdAuditNoteFdId = ctx.session.fdAuditNoteFdId;
        }else{
            rspObj.flag = "fail";
        }
        console.log(rspObj)
        return rspObj;
    },
    async oaSubmit(ctx){
        let url = Base64.decode(ctx.request.query.url);
        console.log(url);
        let formData = {};
        for(let key in ctx.request.body){
            let temp = key.replace(/#/g,'.')
            formData[temp] = ctx.request.body[key];
        }
        // console.log(formData)
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData: formData
        });
        let $ = jqlite(rs.body);
        // console.log(rs.body.trim());
        let msg = $("div[class = 'msgtitle']").text();
        let rspObj = {
            info:msg
        };
        if(msg.indexOf("已成功") > -1 || msg.indexOf("was successful") > -1){
            rspObj.flag = "success";
        }else{
            rspObj.flag = "fail";
        }
        return rspObj;
    },
    async getpeople(ctx){
        let cur_userid = ctx.request.body.cur_userid;
        let handle_id = ctx.request.body.handle_id;
        
        let formData = {
            s_bean:ctx.request.body.s_bean,
            orgType:ctx.request.body.orgType,
        };
        if(ctx.request.body.key && ctx.request.body.key!= ''){
            formData.startWidth =  ctx.request.body.startWith;
            formData.key =  ctx.request.body.key;
        }
        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: formData
        });
        console.log(rs.body.trim())
        let $ = jqlite(rs.body);
        let list = [];
        $("dataList data").each((i,e)=>{
            let id = $(e).attr('id');
            //过滤本人以及已选择人员
            if(id == cur_userid){
            }else{
                let item = {
                    id:id,
                    name:$(e).attr('name'),
                    img:$(e).attr('img'),
                    parentName:$(e).attr('parentname'),
                }
                if(handle_id.indexOf(id) > -1){
                    item.checked="true";
                }else{
                    item.checked="false";
                }
                list.push(item);
            }
        });
        return {
            list
        }
    },
    async set_recent_people(ctx){
        let contactIds = ctx.request.body.contactIds;
        let rs = await fetch(`${OA_URL}/ekp/sys/organization/sys_organization_recent_contact/sysOrganizationRecentContact.do`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData: {
                method:"addContacts",
                contactIds:contactIds
            }
        });
    //    console.log(rs.body);
       return rs.body
    },
    async chuchaiAddInfo(ctx){
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_main/kmReviewMain.do?method=add&fdTemplateId=14153d1b693cea9edaf27a2488f8583c`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let rspObj = {};
        //申请人
        rspObj.application = $("input[name = 'extendDataFormInfo.value(fd_application_name.name)']").val();
        //部门
        rspObj.fdClaimantDeptName = $("input[name = 'extendDataFormInfo.value(fd_application_dept)']").val();
        //提交人ID
        rspObj.subId = $("input[name = 'sysWfBusinessForm.fdHandlerRoleInfoIds']").val();
        //提交人name
        rspObj.subName = $("input[name = 'sysWfBusinessForm.fdHandlerRoleInfoNames']").val();

        //机票选择人时请求地址
        rspObj.seljipiaopersonurl =  rs.body.match(/function _clickSqlSelect_fd_ticket_itineraryindexfd_flight_person\(\)[\s\S]*?var sql.*?\"(.*?)=:HRIS_CC/)[1]+"='"+$("input[name = 'extendDataFormInfo.value(fd_hris_cc)']").val()+"'";
        //成本中心请求地址
        rspObj.chengbenzhongxinurl =  rs.body.match(/encodeURIComponent\(getSqlValue_fd_ticket_itineraryindexfd_costcenter\(.*?\"(.*?)\"/)[1];
        
        let hid_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            if($(e).attr('name') === 'extendDataFormInfo.value(fd_application_id)'){
                hid_arr.push({
                    name:"extendDataFormInfo.value(fd_application_id)",
                    value:$("input[name='extendDataFormInfo.value(fd_applicant.id)']").val()
                })
            }else if($(e).attr('name') && $(e).attr('name').indexOf("fd_list_person.!{index}.")<0 && $(e).attr('name').indexOf("fd_list_business.!{index}")<0){
                hid_arr.push({
                    name:$(e).attr("name"),
                    value:$(e).attr("value"),
                })
            }
        });

        //填单人姓名
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_applicant.name)",
            value: $("input[name='extendDataFormInfo.value(fd_applicant.name)']").val()
        })
        //填单人工号
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_applicant_no)",
            value: $("input[name='extendDataFormInfo.value(fd_applicant_no)']").val()
        })
        //申请人姓名
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_application_name.name)",
            value: $("input[name='extendDataFormInfo.value(fd_application_name.name)']").val()
        })
        //申请人部门
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_applicant_dept)",
            value: $("input[name='extendDataFormInfo.value(fd_applicant_dept)']").val()
        })
         //申请人工号
         hid_arr.push({
            name: "extendDataFormInfo.value(fd_application_no)",
            value: $("input[name='extendDataFormInfo.value(fd_application_no)']").val()
        })
        //出差时间初始值
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_startvalue)",
            value: $("input[name='extendDataFormInfo.value(fd_startvalue)']").val()
        })
        //培训周期
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_train_period)",
            value: ""
        })
        //费用预算
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_budget)",
            value: ""
        })
        //总计交通费用
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_total_fee)",
            value: ""
        })
        //是否使用因私护照
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_is_private_passport)",
            value: ""
        })
        //因私护照说明
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_private_passport_explain)",
            value: ""
        })
        //交通说明
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_traffic_description)",
            value: ""
        })
        //是否国外驾车
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_abroad_drive)",
            value: "否"
        })
         //其他参数
         hid_arr.push({
            name: "extendDataFormInfo.value(fd_3352e0f5cbb192)",
            value:  $("input[name='extendDataFormInfo.value(fd_3352e0f5cbb192)']").val()
        })
        hid_arr.push({
            name: "fdKeywordNames",
            value:  $("input[name='fdKeywordNames']").val()
        })
        hid_arr.push({
            name: "fdFeedbackNames",
            value:  $("input[name='fdFeedbackNames']").val()
        })
        hid_arr.push({
            name: "docPropertyNames",
            value:  $("input[name='docPropertyNames']").val()
        })
        hid_arr.push({
            name: "handlerIds[0]",
            value:  ""
        })
        hid_arr.push({
            name: "handlerNames[0]",
            value:  ""
        })
        hid_arr.push({
            name: "wf_nodeCanViewCurNodeNames",
            value:  $("textarea[name='wf_nodeCanViewCurNodeNames']").val()
        })
        hid_arr.push({
            name: "wf_otherCanViewCurNodeNames",
            value:  $("textarea[name='wf_otherCanViewCurNodeNames']").val()
        })
        hid_arr.push({
            name: "authReaderNames",
            value:  $("textarea[name='authReaderNames']").val()
        })
        hid_arr.push({
            name: "authAttCopyNames",
            value:  $("textarea[name='authAttCopyNames']").val()
        })
        hid_arr.push({
            name: "authAttDownloadNames",
            value:  $("textarea[name='authAttDownloadNames']").val()
        })
        hid_arr.push({
            name: "authAttPrintNames",
            value:  $("textarea[name='authAttPrintNames']").val()
        })
        //出差类别
        hid_arr.push({
            name: "extendDataFormInfo.value(fd_type)",
            value:  ""
        })
        //常用意见
        hid_arr.push({
            name: "commonUsages",
            value:  ""
        })
        //处理意见
        hid_arr.push({
            name: "fdUsageContent",
            value:  ""
        })
        rspObj.hideInfo = hid_arr;

        let $jsonCacheStr = jqlite($("input[name = 'sysWfBusinessForm.fdCurNodeXML']").val());
        rspObj.taskIdAA = $jsonCacheStr('task').attr('id');
        // 20160721 默认出差人员数据
	    let sqlValue = "select fd_id,fd_name,fd_no,fd_factory_keshi,fd_gid,fd_position_type,fd_date_of_birth,fd_gender,fd_position,fd_id_no,fd_leader,fd_name as fd_name1  from v_person_info where fd_id='"+$("input[name='sysWfBusinessForm.fdCurHanderId']").val()+"'";
        rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                s_bean:"sqlSelectDataBean",
                sqlValue:sqlValue,
                isLoadData:"true",
                dataSource:"null"
            }
        });
        $ = jqlite(rs.body);
        rspObj.data_fd_id = $("data")[0].attribs["fd_id"];
        rspObj.data_gender = $("data")[0].attribs["fd_gender"];
        rspObj.data_position = $("data")[0].attribs["fd_position"];
        rspObj.data_name1 = $("data")[0].attribs["fd_name1"];
        rspObj.data_leader = $("data")[0].attribs["fd_leader"];
        rspObj.data_id_no = $("data")[0].attribs["fd_id_no"];
        rspObj.data_no = $("data")[0].attribs["fd_no"];
        rspObj.data_id = $("data")[0].attribs["fd_id"];
        rspObj.data_name = $("data")[0].attribs["fd_name"];
        rspObj.data_position_type = $("data")[0].attribs["fd_position_type"];
        rspObj.data_fd_name = $("data")[0].attribs["fd_name"];
        rspObj.data_fd_gid = $("data")[0].attribs["fd_gid"];
        rspObj.data_birth = $("data")[0].attribs["fd_birth"];

        return rspObj;
    
    },  
    async sfjpcheckshow(ctx){
        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: ctx.request.body
        });
        let $ = jqlite(rs.body);
        return {
            result:$('data')[0].attribs['fd_is_booking_ticket']
        }

    },
    async xingchengFile(ctx){
        let rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=getuserkey`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                md5:""
            }
        });
        let $ = jqlite(rs.body);
        const formData = {
            Upload:ctx.request.body.Upload,
            Filename:ctx.request.body.Filename,
            domodid:ctx.request.body.domodid,
            Filedata:[]
        }
        ctx.request.files.forEach(item=>{
            formData.Filedata.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let userkey = encodeURIComponent($('userkey').text());
        rs = await fetch(`${OA_URL}/ekp/sys/attachment/uploaderServlet?gettype=upload&userkey=${userkey}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        $ = jqlite(rs.body);
        let file_key = $("filekey").text();
        let Filename = encodeURI(ctx.request.body.Filename);
        let domodid = ctx.request.body.domodid;
        console.log("file_key>>>>>>>>"+file_key);
        let url1 = `${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${file_key}&filename=${Filename}&fdKey=fd_3323b03ebb346a&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=${domodid}`;
        rs = await fetch(url1, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:{}
        });
        $ = jqlite(rs.body);
        console.log(rs.body)
        let rspObj = {
            attid:$("attid").text(),
            attname:$("attname").text(),
            msg:$("msg").text(),
        };
        return rspObj;
    },
    async jiaotongFile(ctx){
        let rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=getuserkey`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                md5:""
            }
        });
        let $ = jqlite(rs.body);
        const formData = {
            Upload:ctx.request.body.Upload,
            Filename:ctx.request.body.Filename,
            domodid1:ctx.request.body.domodid1,
            Filedata:[]
        }
        ctx.request.files.forEach(item=>{
            formData.Filedata.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let userkey = encodeURIComponent($('userkey').text());
        rs = await fetch(`${OA_URL}/ekp/sys/attachment/uploaderServlet?gettype=upload&userkey=${userkey}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        $ = jqlite(rs.body);
        let file_key = $("filekey").text();
        let Filename = encodeURI(ctx.request.body.Filename);
        let domodid = ctx.request.body.domodid1;
        console.log("file_key>>>>>>>>"+file_key);
        let url1 = `${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${file_key}&filename=${Filename}&fdKey=fd_attachment&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=${domodid}`;
        rs = await fetch(url1, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:{}
        });
        $ = jqlite(rs.body);
        console.log(rs.body)
        let rspObj = {
            attid:$("attid").text(),
            attname:$("attname").text(),
            msg:$("msg").text(),
        };
        return rspObj;
    },
    async yijianFile(ctx){
        let rs = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=getuserkey`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                md5:""
            }
        });
        let $ = jqlite(rs.body);
        const formData = {
            Upload:ctx.request.body.Upload,
            Filename:ctx.request.body.Filename,
            domodid2:ctx.request.body.domodid2,
            modid3:ctx.request.body.modid3,
            Filedata:[]
        }
        ctx.request.files.forEach(item=>{
            formData.Filedata.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let userkey = encodeURIComponent($('userkey').text());
        rs = await fetch(`${OA_URL}/ekp/sys/attachment/uploaderServlet?gettype=upload&userkey=${userkey}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        $ = jqlite(rs.body);
        let file_key = $("filekey").text();
        let Filename = encodeURI(ctx.request.body.Filename);
        let domodid = ctx.request.body.domodid2;
        let modid = ctx.request.body.domodid3;
        console.log("file_key>>>>>>>>"+file_key);
        let url1 = `${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${file_key}&filename=${Filename}&fdKey=${modid}&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=${domodid}`;
        rs = await fetch(url1, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:{}
        });
        $ = jqlite(rs.body);
        console.log(rs.body)
        let rspObj = {
            attid:$("attid").text(),
            attname:$("attname").text(),
            msg:$("msg").text(),
        };
        return rspObj;
    },
    async selpeople(ctx){
        let username = encodeURI(ctx.request.body.username)
        let url=`${OA_URL}/ekp/sys/common/dataxml.jsp?s_bean=sqlSelectDataBean&keyword=${username}&column=fd_no_name_fac_keshi&orderby=fd_name%20asc&dataSource=&sqlValue=select%20fd_id%2Cfd_no_name_fac_keshi%2Cfd_name%2Cfd_date_of_birth%2Cfd_gender%2Cfd_position%2Cfd_id_no%2Cfd_leader%20from%20V_PERSON_INFO`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
            }
        });
        let $ = jqlite(rs.body);
        // console.log(rs.body)
        let listdata = [];
        $("dataList data").each((i,e)=>{
            listdata.push({
                id:$(e).attr('id'),
                sex:$(e).attr('fd_gender'),
                position:$(e).attr('fd_position'),
                name:$(e).attr('name'),
                fdname:$(e).attr('fd_name'),
                leader:$(e).attr('fd_leader'),
                birth:$(e).attr('fd_date_of_birth'),
            });
        })
        return {listdata};
    },
    async selpeople1(ctx){
        let username = encodeURI(ctx.request.body.username)
        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                s_bean:"organizationDialogSearch",
                key:ctx.request.body.username,
                accurate:"false",
                orgType:"8",
            }
        });
        let $ = jqlite(rs.body);
        // console.log(rs.body)
        let listdata = [];
        $("dataList data").each((i,e)=>{
            listdata.push({
                id:$(e).attr('id'),
                name:$(e).attr('name'),
            });
        })
        return {listdata};
    },
    async selpeoplejipiao(ctx){
        let username = encodeURI(ctx.request.body.username);
        let seljipiaopersonurl = (ctx.request.body.seljipiaopersonurl);

        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp?s_bean=sqlSelectDataBean&keyword=${username}&column=fd_name,fd_no&orderby=fd_name%20asc&dataSource=&sqlValue=${seljipiaopersonurl}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
            }
        });
        let $ = jqlite(rs.body);
        console.log(rs.body)
        let listdata = [];
        $("dataList data").each((i,e)=>{
            listdata.push({
                id:$(e).attr('id'),
                FD_NO:$(e).attr('fd_no'),
                name:$(e).attr('name'),
                FD_NAME:$(e).attr('fd_name'),
                FIRST_NAME:$(e).attr('first_name'),
                LAST_NAME:$(e).attr('last_name'),
                FD_WF_CC_CODE:$(e).attr('fd_wf_cc_code'),
                FD_WF_CC_NAME:$(e).attr('fd_wf_cc_name'),
                OM1_GID:$(e).attr('om1_gid'),
            });
        })
        return {listdata};
    },
    async chufajipiao(ctx){
        let username = encodeURI(ctx.request.body.username);

        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp?s_bean=sqlSelectDataBean&keyword=${username}&column=CITYNAME,AIRPORTCITYCODE,NAME,CODE&orderby=CITYNAME&dataSource=&sqlValue=SELECT%20CODE%20FD_ID%2CCITYNAME%7C%7C%27(%27%7C%7CAIRPORTCITYCODE%7C%7C%27)%27%7C%7C%27-%27%7C%7CNAME%7C%7C%27(%27%7C%7CCODE%7C%7C%27)%27%20FD_NAME%2CCITYNAME%2CAIRPORTCITYCODE%20FROM%20EKP_DMAIR%20WHERE%20COUNTRYCODE%20%3D%20%27CN%27%20AND%20TAG%20%3D%20%27Airport%27`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
            }
        });
        let $ = jqlite(rs.body);
        console.log(rs.body)
        let listdata = [];
        $("dataList data").each((i,e)=>{
            listdata.push({
                id:$(e).attr('id'),
                FD_ID:$(e).attr('fd_id'),
                AIRPORTCITYCODE:$(e).attr('airportcitycode'),
                name:$(e).attr('name'),
                FD_NAME:$(e).attr('fd_name'),
                CITYNAME:$(e).attr('cityname'),
            });
        })
        return {listdata};
    },
    async chengbenzhongxin(ctx){
        let username = encodeURI(ctx.request.body.username);
        let chengbenzhongxinurl = ctx.request.body.chengbenzhongxinurl;

        let rs = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp?s_bean=sqlSelectDataBean&keyword=${username}&column=HRIS_CC,COSTCENTERNAME&orderby=HRIS_CC%20asc&dataSource=&sqlValue=${chengbenzhongxinurl}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
            }
        });
        let $ = jqlite(rs.body);
        console.log(rs.body)
        let listdata = [];
        $("dataList data").each((i,e)=>{
            listdata.push({
                id:$(e).attr('id'),
                name:$(e).attr('name'),
            });
        })
        return {listdata};
    },
    async chuchaiSubmit(ctx){
        let formData = {};
        for(let key in ctx.request.body){
            let temp = key.replace(/#/g,'.')
            formData[temp] = ctx.request.body[key];
        }
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_main/kmReviewMain.do?method=save&fdTemplateId=14153d1b693cea9edaf27a2488f8583c&s_seq=1`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData: formData
        });
        let $ = jqlite(rs.body);
        // console.log(rs.body.trim());
        let msg = $("div[class = 'msgtitle']").text();
        let rspObj = {
            info:msg
        };
        if(msg.indexOf("已成功") > -1 || msg.indexOf("was successful") > -1){
            rspObj.flag = "success";
        }else{
            rspObj.flag = "fail";
        }
        return rspObj;
    },
}