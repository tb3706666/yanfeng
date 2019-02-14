

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const utils = require('chestnut-utils');
const config = require('../configs/config');
const { hr:HR_URL,hrnew:HRNEW_URL } = require('../configs/config').systemPath;
const fs = require('fs');
module.exports = {
    async getDbList(ctx){
        let url = `${HR_URL}/flow/runtime/TaskList.aspx?flowid=${ctx.query.flowid}&pageindex=${ctx.query.pageindex}&sortColumn=`;
        
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        const $ = jqlite(rs.body);
        let tables = []; 
        $('table[id="list"] tr').filter(i=>i>0).each(function(index,e){
            let rs1 = "";
            let rs2 = "";
            let rs3 = "";
            let rs4 = "";
            let rs5 = "";
            let isFirst = "";
            if($(e).find('td').eq(2).find('select').length==0){
                rs1 = $(e).find('td').eq(2).text().trim();
                rs2 = $(e).find('td').eq(4).text().trim();
                rs3 = $(e).find('td').eq(5).text().trim();
                rs4 = $(e).find('td').eq(6).text().trim();
                rs5 = $(e).attr('key');
                isFirst = "true";
            }else{
                 rs1 = $(e).find('td').eq(5).text().trim();
                 rs2 = $(e).find('td').eq(7).text().trim();
                 rs3 = $(e).find('td').eq(8).text().trim();
                 rs4 = $(e).find('td').eq(9).text().trim();
                 rs5 = $(e).attr('key');
                 isFirst = "false";
            }
           
            tables.push({
                rs1:rs1,
                rs2:rs2,
                rs3:rs3,
                rs4:rs4,
                rs5:rs5,
                isFirst:isFirst
            })
        })
        return {
            dbList:tables,
            resit:'n'
        }
    },
    async qingjiasearch(ctx){
        let searchInfo = encodeURIComponent(ctx.request.body.searchInfo);
        let url = `${HR_URL}/flow/runtime/HistoryList.aspx?flowid=2110&pageindex=${ctx.request.body.start}&filters=[{"col":"a39","key":"${searchInfo}","op":"${ctx.request.body.sel}"},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""}]&sortColumn=`;
        // console.log(url)
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        const $ = jqlite(rs.body);
        let tables = []; 
        $('table[id="ctl03"] tr').filter(i=>i>0).each(function(index,e){
            let rs1 = $(e).find('td').eq(2).text().trim();
            let rs2 = $(e).find('td').eq(4).text().trim();
            let rs3 = $(e).find('td').eq(5).text().trim();
            let rs4 = $(e).find('td').eq(6).text().trim();
            let rs5 = $(e).attr('key');
            if(rs5.indexOf(".")>-1){
                rs5 = rs5.substring(0, rs5.indexOf("."));
            }
            tables.push({
                rs1:rs1,
                rs2:rs2,
                rs3:rs3,
                rs4:rs4,
                rs5:rs5,
            })
        })
        return {
            dbList:tables,
            resit:'n'
        }
    },
    async faqi_qingjiasearch(ctx){
        let url = `${HR_URL}/flow/runtime/InitList.aspx?flowid=2110&pageindex=${ctx.request.body.start}&sortColumn=`;
        // console.log(url)
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        const $ = jqlite(rs.body);
        let tables = []; 
        $('table[id="ctl03"] tr').filter(i=>i>0).each(function(index,e){
            let rs1 = $(e).find('td').eq(2).text().trim();
            let rs2 = $(e).find('td').eq(4).text().trim();
            let rs3 = $(e).find('td').eq(5).text().trim();
            let rs4 = $(e).find('td').eq(6).text().trim();
            let rs5 = $(e).attr('key');
            if(rs5.indexOf(".")>-1){
                rs5 = rs5.substring(0, rs5.indexOf("."));
            }
            tables.push({
                rs1:rs1,
                rs2:rs2,
                rs3:rs3,
                rs4:rs4,
                rs5:rs5,
            })
        })
        return {
            dbList:tables,
            resit:'n'
        }
    },
    async qingjiadetail(ctx){
        let url = `${HR_URL}/flow/runtime/ApproveIns.aspx?flowid=2110&taskid=${ctx.request.body.unid}`;
        let rs1 = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let rs2 = await fetch(`${HR_URL}/flow/runtime/SetRemark.aspx`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs1.body);
   
        //请假申请表单信息
        let result = {
            action:$("form[id='form1']").attr('action'),
            xm:$("span[id = 'F1_1_C8']").text(),
            bm:$("span[id = 'F1_1_C9']").text(),
            jqsm:$("span[id = 'F1_1_C3']").text(),
            gjlx:$("span[id = 'F1_1_C11']").text(),
            dkcd:$("span[id = 'F1_1_C20']").text(),
            qjcd:$("span[id = 'F1_1_C32']").text(),
            dw:$("span[id = 'F1_1_C21']").text(),
        };
        if($("span[id = 'F1_1_C2']").length==0){
            result.zt = $("input[id = 'F1_1_C2']").val();
        }else{
            result.zt = $("span[id = 'F1_1_C2']").text();
        }
        if($("span[id = 'F1_1_C10']").length==0){
            $("select[id='F1_1_C10'] option").each(function(index,e){
                if($(e).attr('selected')){
                    result.qjlx = $(e).text();
                }
            });
        }else{
            result.qjlx = $("span[id = 'F1_1_C10']").text();
        }
        if($("span[id = 'F1_1_C18']").length==0){
            result.kssj = $("input[id = 'F1_1_C18']").val();
        }else{
            result.kssj = $("span[id = 'F1_1_C18']").text();
        }
        if($("span[id = 'F1_1_C19']").length==0){
            result.jssj = $("input[id = 'F1_1_C19']").val();
        }else{
            result.jssj = $("span[id = 'F1_1_C19']").text();
        }
        if($("xmp[id = 'F1_1_C26']").length==0){
            result.ly = $("textarea[id = 'F1_1_C26']").val();
        }else{
            result.ly = $("xmp[id = 'F1_1_C26']").text();
        }
        
        let formArr = [];//请假申请表单流附件数组
        $("span[class='fileitem']").each(function(index,e){
            let fileCache = $(e).find('a').eq(0).attr('onclick');
            if(fileCache.indexOf("display('") > -1){
                fileCache = fileCache.substring(fileCache.indexOf("display('")+9, fileCache.indexOf("','"));
                formArr.push({
                    fileName:$(e).find('a').eq(0).text().replace(/&/g,'&amp;'),
                    fileUrl:"/AttachDownload.aspx?attachid=" + fileCache.replace(/&/g,'&amp;')
                });
            }
        });
        result.fileInfo = formArr;
        
        let hisArr =[];//请假申请审批历史数组
        $("table[id = 'tbHisInfo'] tbody tr").each(function(index,e){
            if($(e).find('td').length>1){
                // console.log($(e).css('color'))
                if($(e).css("color")=='red'){
                    if($(e).next('tr').length>0 && $(e).next('tr').find('td').length<2){
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:$(e).next('tr').eq(0).find('td b').eq(0).text(),
                            cur:'true'
                        })
                    }else{
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:'fiberhome',
                            cur:'true'
                        })
                    }
                }else{
                    if($(e).next('tr').length>0 && $(e).next('tr').find('td').length<2){
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:$(e).next('tr').eq(0).find('td b').eq(0).text(),
                            cur:'false'
                        })
                    }else{
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:'fiberhome',
                            cur:'false'
                        })
                    }
                }

            }
        });
        result.hisInfo = hisArr;
        //请假申请审批提交所需参数数组
        result.hrid = rs1.body.match(/InsObject.hrid        = \"(.*?)\"/)[1];
        result.flowid = rs1.body.match(/InsObject.flowid        = \"(.*?)\"/)[1];
        result.nodeid = rs1.body.match(/InsObject.nodeid        = \"(.*?)\"/)[1];
        result.flowVersion = rs1.body.match(/InsObject.flowVersion   = \"(.*?)\"/)[1];
        result.procTime = rs1.body.match(/InsObject.procTime      = \"(.*?)\"/)[1];
        result.taskId = rs1.body.match(/InsObject.taskId        = \"(.*?)\"/)[1];
        result.instanceId = rs1.body.match(/InsObject.instanceId    = \"(.*?)\"/)[1];
        result.slotId = rs1.body.match(/InsObject.slotId        = \"(.*?)\"/)[1];
        result.startTime = rs1.body.match(/InsObject.startTime = \'(.*?)\'/)[1];
        result.dataVersion = rs1.body.match(/InsObject.dataVersion = \'(.*?)\'/)[1];
        result.jPack = rs1.body.match(/window.jPack = (\{.*?});/)[1];
       
        let butArr = []; //请假申请操作按钮数组
        $("div[class='anniu_x']").each(function(index,e){
            let text = $(e).find('div').eq(1).find('a').text();
            if(text == '导出打印'||text == '返回'||text == 'Print(PDF)'||text == 'Back'){

            }else if(text == '回退历史审批人'){
                let butStr = $(e).attr('onclick');
                butArr.push({
                    butText:text,
                    butValue:butStr.substring(butStr.indexOf("showHistoryList(")+16,butStr.indexOf(");'")),
                });
            }else{
                butArr.push({
                    butText:text,
                    butValue:'',
                });
            }
        })
        result.butInfo = butArr;

        
        let selectArr = [];//请假申请常用意见数组
        let selectCache = rs2.body.match(/var list = \[(.*?)]/)[1].split(",");
        $ = jqlite(rs2.body);
        $("select[name = 'dlList'] option").each(function(i,e){
            selectArr.push({
                selText:$(e).text().replace(/—/g, "-"),
                selValue:selectCache[i].replace(/"/g,"")
            })
        });
        result.selInfo = selectArr;
        return result;
    },
    async qingjiayiban(ctx){
        let url = `${HR_URL}/flow/runtime/ViewIns.aspx?flowid=2110&action=edit&instanceid=${ctx.request.body.unid}&isinitiator=true`;
        let rs1 = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let rs2 = await fetch(`${HR_URL}/flow/runtime/SetRemark.aspx`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs1.body);
   
        //请假申请表单信息
        let result = {
            action:$("form[id='form1']").attr('action'),
            xm:$("span[id = 'F1_1_C8']").text(),
            bm:$("span[id = 'F1_1_C9']").text(),
            jqsm:$("span[id = 'F1_1_C3']").text(),
            gjlx:$("span[id = 'F1_1_C11']").text(),
            dkcd:$("span[id = 'F1_1_C20']").text(),
            qjcd:$("span[id = 'F1_1_C32']").text(),
            dw:$("span[id = 'F1_1_C21']").text(),
        };
        if($("span[id = 'F1_1_C2']").length==0){
            result.zt = $("input[id = 'F1_1_C2']").val();
        }else{
            result.zt = $("span[id = 'F1_1_C2']").text();
        }
        if($("span[id = 'F1_1_C10']").length==0){
            $("select[id='F1_1_C10'] option").each(function(index,e){
                if($(e).attr('selected')){
                    result.qjlx = $(e).text();
                }
            });
        }else{
            result.qjlx = $("span[id = 'F1_1_C10']").text();
        }
        if($("span[id = 'F1_1_C18']").length==0){
            result.kssj = $("input[id = 'F1_1_C18']").val();
        }else{
            result.kssj = $("span[id = 'F1_1_C18']").text();
        }
        if($("span[id = 'F1_1_C19']").length==0){
            result.jssj = $("input[id = 'F1_1_C19']").val();
        }else{
            result.jssj = $("span[id = 'F1_1_C19']").text();
        }
        if($("xmp[id = 'F1_1_C26']").length==0){
            result.ly = $("textarea[id = 'F1_1_C26']").val();
        }else{
            result.ly = $("xmp[id = 'F1_1_C26']").text();
        }
        
        let formArr = [];//请假申请表单流附件数组
        $("span[class='fileitem']").each(function(index,e){
            let fileCache = $(e).find('a').eq(0).attr('onclick');
            if(fileCache.indexOf("display('") > -1){
                fileCache = fileCache.substring(fileCache.indexOf("display('")+9, fileCache.indexOf("','"));
                formArr.push({
                    fileName:$(e).find('a').eq(0).text().replace(/&/g,'&amp;'),
                    fileUrl:"/AttachDownload.aspx?attachid=" + fileCache.replace(/&/g,'&amp;')
                });
            }
        });
        result.fileInfo = formArr;
        
        let hisArr =[];//请假申请审批历史数组
        $("table[id = 'tbHisInfo'] tbody tr").each(function(index,e){
            if($(e).find('td').length>1){
                console.log($(e).css('color'))
                if($(e).css("color")=='red'){
                    if($(e).next('tr').length>0 && $(e).next('tr').find('td').length<2){
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:$(e).next('tr').eq(0).find('td b').eq(0).text(),
                            cur:'true'
                        })
                    }else{
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:'fiberhome',
                            cur:'true'
                        })
                    }
                }else{
                    if($(e).next('tr').length>0 && $(e).next('tr').find('td').length<2){
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:$(e).next('tr').eq(0).find('td b').eq(0).text(),
                            cur:'false'
                        })
                    }else{
                        hisArr.push({
                            td1:$(e).find('td').eq(0).text(),
                            td2:$(e).find('td').eq(1).text(),
                            td3:$(e).find('td').eq(2).text(),
                            td4:$(e).find('td').eq(3).text(),
                            td5:$(e).find('td').eq(4).text(),
                            td6:'fiberhome',
                            cur:'false'
                        })
                    }
                }

            }
        });
        result.hisInfo = hisArr;
        //请假申请审批提交所需参数数组
        result.hrid = rs1.body.match(/InsObject.hrid        = \"(.*?)\"/)[1];
        result.flowid = rs1.body.match(/InsObject.flowid        = \"(.*?)\"/)[1];
        result.nodeid = rs1.body.match(/InsObject.nodeid        = \"(.*?)\"/)[1];
        result.flowVersion = rs1.body.match(/InsObject.flowVersion   = \"(.*?)\"/)[1];
        result.procTime = rs1.body.match(/InsObject.procTime      = \"(.*?)\"/)[1];
        result.taskId = rs1.body.match(/InsObject.taskId        = \"(.*?)\"/)?rs1.body.match(/InsObject.taskId        = \"(.*?)\"/)[1]:'';
        result.instanceId = rs1.body.match(/InsObject.instanceId    = \"(.*?)\"/)?rs1.body.match(/InsObject.instanceId    = \"(.*?)\"/)[1]:'';
        result.slotId = rs1.body.match(/InsObject.slotId        = \"(.*?)\"/)?rs1.body.match(/InsObject.slotId        = \"(.*?)\"/)[1]:'';
        result.startTime = rs1.body.match(/InsObject.startTime = \'(.*?)\'/)?rs1.body.match(/InsObject.startTime = \'(.*?)\'/)[1]:'';
        result.dataVersion = rs1.body.match(/InsObject.dataVersion = \'(.*?)\'/)?rs1.body.match(/InsObject.dataVersion = \'(.*?)\'/)[1]:'';
        result.jPack = rs1.body.match(/window.jPack = (\{.*?});/)[1];
       
        let butArr = []; //请假申请操作按钮数组
        $("div[class='anniu_x']").each(function(index,e){
            let text = $(e).find('div').eq(1).find('a').text();
            if(text == '导出打印'||text == '返回'||text == 'Print(PDF)'||text == 'Back'){

            }else if(text == '回退历史审批人'){
                let butStr = $(e).attr('onclick');
                butArr.push({
                    butText:text,
                    butValue:butStr.substring(butStr.indexOf("showHistoryList(")+16,butStr.indexOf(");'")),
                });
            }else{
                butArr.push({
                    butText:text,
                    butValue:'',
                });
            }
        })
        result.butInfo = butArr;

        
        let selectArr = [];//请假申请常用意见数组
        let selectCache = rs2.body.match(/var list = \[(.*?)]/)[1].split(",");
        $ = jqlite(rs2.body);
        $("select[name = 'dlList'] option").each(function(i,e){
            selectArr.push({
                selText:$(e).text().replace(/—/g, "-"),
                selValue:selectCache[i]
            })
        });
        result.selInfo = selectArr;
        return result;
    },
    async AttachDownload(ctx){
        let rs = await fetch(`${HR_URL}/AttachDownload.aspx?attachid=${ctx.query.attachid}`, {
            ctx: ctx,
            method: 'get',
            headers: {
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },function(){});
        return rs;
    },
    async qingjiasubmit(ctx){
        let url = `${HR_URL}/AjaxJSONProcess.aspx`;
        console.log(ctx.request.body.jsonData);
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:ctx.request.body.jsonData
        });
        console.log(rs.body);
        let flag = '';
        if(rs.body.indexOf("r:0") > -1){
            flag="success";
        } else {
            flag="fail";
        }
        return {
            flag:flag
        }
    },
    async qingjiachoose(ctx){
        let url = `${HR_URL}/AjaxJSONProcess.aspx`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:ctx.request.body.jsonData
        });
        let $ = jqlite(rs.body);
        let peoArr = [];
        $("div[class = 'divitem']").each(function(i,e){
            peoArr.push({
                peoName:$(e).find('a').eq(0).text(),
                peoKey:$(e).attr("key")
            });
        })
        return {
            peoInfo:peoArr
        }
    },
    async qingjiahistory(ctx){
        let url = `${HR_URL}/flow/runtime/HistoryNodeList.aspx?flowid=${ctx.request.body.flowid}&instanceid=${ctx.request.body.instanceId}&nodeid=${ctx.request.body.nodeid}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs.body);
        let selArr = [];
        $("select[name ='DropDownList1'] option").each(function(i,e){
            selArr.push({
                selText:$(e).text().replace(/—/g, "-"),
                selValue:$(e).val().replace(/—/g, "-"),
            });
        })
        return {
            selInfo:selArr
        }
    },
    async getQingjianew(ctx){
        const dbConfig = config.database['oracle'];
        const db = utils.db(dbConfig);
        let sql = `SELECT * FROM EKP.VW_BASE_INFO_APP where gid = ?`, params = [ctx.request.body.name];
        let rs = await db.query(sql, params);
        if(rs.error) return false;
        let result =[];
        rs.rows.forEach((element,index) => {
            let temp = {};
            element.forEach((e,i)=>{
                temp[rs.metaData[i].name.toLowerCase()] = e==null?'':e;
            });
            result.push(temp);
        });
        let listData = {
            car_free:result[0].car_free,
            mobile_free:result[0].mobile_free,
            mobile_type:result[0].mobile_type,
            mobile_limit:result[0].mobile_limit,
            card_no:result[0].card_no,
            card_name:result[0].card_name,
            bank_no:result[0].bank_no,
            bankname:result[0].bankname,
        };
        let url = `${HR_URL}/AjaxJSONProcess.aspx`;
        rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body:'{"FuncName":"fm.WindowProcess.GetFramework"}{:ky->w{"Path":"1.1001.479","Parameters":{},"Data":{},"OperaParam":{},"Width":1443,"Height":621,"Url":"https://ae-hrbs.adient.com/YFJC_NEWAD/Window/Window.aspx?wind=230012","Init":true,"CurrentForm":"","ParamHtml":"","Popup":true}'
        });
        let $ = jqlite(rs.body);
        let listData1 = {
            imageurl:$("table[id='G_A1'] tr").eq(0).find('td').eq(0).find('div').eq(0).find('img').eq(0).attr('src'),
            username:$("table[id='G_A1'] tr").eq(1).find('td').eq(1).find('span').text(),
            empcode:$("table[id='G_A1'] tr").eq(0).find('td').eq(2).find('span').text(),
        }
        return {
            listData:listData,
            listData1:listData1
        }
    },
    async newqingjia(ctx){
        let url ='';
        if(HR_URL.indexOf('https')>-1){
            url = HRNEW_URL+'/hrmobilesvc/hr.asmx';
        }else{
            url = HRNEW_URL+'/WebSvcBuilderSetup/Hr.asmx';
        }
        console.log('HR 提交地址'+url)
        let {BADGE,TITLE,ATTENDTYPE,PUBLICTYPE,BEGINDATE,ENDDATE,LEAVEREASON,REMARK,FUJIANs} = ctx.request.body;
        let rs = await fetch(url, {
            method: 'post',
            headers: {
                "Content-Type":"text/xml;charset=UTF-8",
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://ns.kayang.com/">
            <soapenv:Header/>
            <soapenv:Body>
               <ns:REGLEAVE_REGISTER_DRAFT>
                  <xml><![CDATA[<DataTable><RowData><BADGE>${BADGE}</BADGE><TITLE>${TITLE}</TITLE><ATTENDTYPE>${ATTENDTYPE}</ATTENDTYPE><PUBLICTYPE>${PUBLICTYPE}</PUBLICTYPE><BEGINDATE>${BEGINDATE}</BEGINDATE><ENDDATE>${ENDDATE}</ENDDATE><LEAVEREASON>${LEAVEREASON}</LEAVEREASON><REMARK>${REMARK}</REMARK><FUJIAN>${FUJIANs}</FUJIAN></RowData></DataTable>]]></xml>
               </ns:REGLEAVE_REGISTER_DRAFT>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        console.log(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://ns.kayang.com/">
        <soapenv:Header/>
        <soapenv:Body>
           <ns:REGLEAVE_REGISTER_DRAFT>
              <xml><![CDATA[<DataTable><RowData><BADGE>${BADGE}</BADGE><TITLE>${TITLE}</TITLE><ATTENDTYPE>${ATTENDTYPE}</ATTENDTYPE><PUBLICTYPE>${PUBLICTYPE}</PUBLICTYPE><BEGINDATE>${BEGINDATE}</BEGINDATE><ENDDATE>${ENDDATE}</ENDDATE><LEAVEREASON>${LEAVEREASON}</LEAVEREASON><REMARK>${REMARK}</REMARK><FUJIAN>${FUJIANs}</FUJIAN></RowData></DataTable>]]></xml>
           </ns:REGLEAVE_REGISTER_DRAFT>
        </soapenv:Body>
     </soapenv:Envelope>`);
        console.log(rs.body.match(/<REGLEAVE_REGISTER_DRAFTResult xmlns="">(.*?)<\/REGLEAVE_REGISTER_DRAFTResult>/)[1])
        return rs.body.match(/<REGLEAVE_REGISTER_DRAFTResult xmlns="">(.*?)<\/REGLEAVE_REGISTER_DRAFTResult>/)[1];
    },
    async addfile(ctx){
        console.log(ctx.request.files);
        const formData = {
            FILE_NAME:[]
        }
        ctx.request.files.forEach(item=>{
            formData.FILE_NAME.push({
                value:fs.createReadStream(item.path),
                options: {
                    filename: item.originalname,
                    contentType: item.mimetype,
                }
            })
        });
        let rs = await fetch(`${HRNEW_URL}/WebSvcBuilderSetup/AttachUpload.aspx`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        return rs.body;
    },
    
    
};