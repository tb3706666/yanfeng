const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;
module.exports = {
    async cgshdlist(ctx){
        let pageNum = ctx.request.body.page;
        let url_param = "method=list&nodeType=TEMPLATE&q.fdTemplate=1471f7d4ce6e063190e972d4d938b37c&q.mydoc=approval";
        if(pageNum!=""){
            url_param = url_param + "&pageno=" + pageNum + "&rowsize=15&q.s_raq=0.11948571410121079";
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
    async cgshddetail(ctx){
        let rs = await fetch(`${OA_URL}/ekp/km/review/km_review_main/kmReviewMain.do?method=view&fdId=${ctx.request.body.fdId}`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        // console.log(rs.body.trim())
        let $ = jqlite(rs.body);
        let rspObj = {};
        
        let fdModelId = $("input[name = 'sysWfBusinessForm.fdModelId']").val();
        let fdModelName = $("input[name = 'sysWfBusinessForm.fdModelName']").val();
        let fdId = $("input[name = 'fdId']").val();
        let action =  $("form").attr('action');
        let shenPiUrl = `${OA_URL}/ekp/sys/workflow/sys_wf_audit_note/sysWfAuditNote.do?method=listNote&fdModelId=${fdId}&formBeanName=kmReviewMainForm`;
        rspObj.action = `${OA_URL}${action}?method=publishDraft&fdId=${fdModelId}&s_seq=1`;
        
        rspObj.zt = $('form p').text().trim();
        rspObj.sqr = $('form div table tbody').find('tr').eq(1).find('td').eq(1).find('div').eq(0).text().trim();
        rspObj.sqrbm = $('form div table tbody').find('tr').eq(1).find('td').eq(3).find('div').eq(0).text().trim();
        rspObj.shrq = $('form div table tbody').find('tr').eq(1).find('td').eq(5).find('div').eq(0).text().trim();
        rspObj.ccjssj = $('form div table tbody').find('tr').eq(2).find('td').eq(1).text().trim();
        rspObj.tdr = $('form div table tbody').find('tr').eq(2).find('td').eq(3).find('div').eq(0).text().trim();
        rspObj.leixing = $('form div table tbody').find('tr').eq(2).find('td').eq(5).find('input[checked]').eq(0).parent('label').text();

        //是否可编辑
        let isbjflag="1";//可编辑
        if($("input[name='_extendDataFormInfo.value(FD_GR_PARTTYPE)']").length==0){
	 		isbjflag="0";//不可编辑
	 	}    
        rspObj.isbjflag = isbjflag;

         //收货类型
        let  shlxArr = [];
        $('form div table tbody').find('tr').eq(3).find('td').eq(1).find("input[type='checkbox']").each((i,e)=>{
            shlxArr.push({
                name: $(e).parent('label').text(),
                checked:$(e).attr('onclick')?true:false
            });
        })
        rspObj.shlxArr = shlxArr;
        rspObj.beizhu = $('form div table tbody').children('tr').eq(5).find('td').eq(1).find('label').eq(0).text().trim();
        rspObj.caigoudanhao = $('form div table tbody').find('tr').eq(4).find('td').eq(1).find('div').eq(0).text().trim();
        rspObj.caigoudantitle = $('form div table tbody').find('tr').eq(4).find('td').eq(0).find('label').eq(0).text().trim();
            
        let tableArr = [];
        let tableThArr = [];
        $("table[id='TABLE_DL_FD_GR_DETAIL'] tr[kmss_iscontentrow='1']").each((i,e)=>{
            let tempArray = [];
            $(e).find("td").each((i1,e1)=>{
                tempArray.push({
                    value:$(e1).text().trim()
                });
            })
            tableArr.push(tempArray)
        })
        $("table[id='TABLE_DL_FD_GR_DETAIL']").find("tr").eq(0).find("td").each((i,e)=>{
            tableThArr.push($(e).text().trim())
        })
        rspObj.mxtableArr = tableArr;
        rspObj.mxThtable = tableThArr;

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
                    pass_json.nodeusername = $flowContentCache(`reviewnode[id='${endnodeid}']`).attr('name');
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
        return rspObj;
    },
}