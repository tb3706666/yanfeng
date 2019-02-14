

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL,hr:HR_URL } = require('../configs/config').systemPath;
const utils = require('chestnut-utils');
const config = require('../configs/config');
var moment = require('moment');
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
    async lizhisearch(ctx){
        let searchInfo = ctx.request.body.searchInfo;
        let url = `${HR_URL}/flow/runtime/HistoryList.aspx?flowid=2310&pageindex=${ctx.request.body.start}&filters=[{"col":"A4","key":"${searchInfo}","op":"${ctx.request.body.sel}"},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""},{"col":"A1","key":"","op":""}]&sortColumn=`;
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
    async lizhidetail(ctx){
        let url = `${HR_URL}/flow/runtime/ApproveIns.aspx?flowid=2310&taskid=${ctx.request.body.unid}`;
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
            xm:$("span[id = 'F2_1_C13']").text(),
            bm:$("div[id = 'F2_1_C18']").text(),
            qjlx:$("span[id = 'F2_1_C5']").text(),
            kssj:$("span[id = 'F2_1_C20']").text(),
            dkcd:$("span[id = 'F2_1_C23']").text(),
            jqsm:$("xmp[id = 'F2_1_C26']").text(),
            tdrsm:$("xmp[id = 'F2_1_C17']").text(),

            gjlx:$("span[id = 'F2_1_C5']").text(),
            qjcd:$("span[id = 'F1_1_C32']").text(),
            dw:$("span[id = 'F1_1_C21']").text(),
        };
        if($("span[id = 'F2_1_C16']").length==0){
            result.zt = $("input[id = 'F2_1_C16']").val();
        }else{
            result.zt = $("span[id = 'F2_1_C16']").text();
        }
        if($("span[id = 'F2_1_C22']").length==0){
            result.jssj = $("input[id = 'F2_1_C22']").val();
        }else{
            result.jssj = $("span[id = 'F2_1_C22']").text();
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
        let qianshoudanArr = [];//签收单
        $("div[class = 'subform'][style!='display:none'] table[class='multitable'] tbody").each((i,e1)=>{
            let cache_obj = {};
            cache_obj.displayflag = $(e1).attr('style');
            let qianshoulist = [];
            $(e1).find('tbody tr').each((index,e2)=>{
                let qianshou_obj = {};
                qianshou_obj.inputid = $(e2).find('td').eq(2).find('input').eq(0).attr('id');
                qianshou_obj.spantext = $(e2).find('td').eq(0).find('span').eq(0).text();
                qianshou_obj.selectid = $(e2).find('td').eq(1).find('select').eq(0).attr('id');
                let selectlist = [];
                $(e2).find('td').eq(1).find('select option').each((index1,e3)=>{
                    console.log($(e3).attr('selected')!=undefined)
                    selectlist.push({
                        optiontext:$(e3).text(),
                        optionvalue:$(e3).attr('value'),
                        optionselect:$(e3).attr('selected')!=undefined?"true":"false",
                    })
                })
                qianshou_obj.selectlist = selectlist;
                qianshoulist.push(qianshou_obj);
            })
            cache_obj.qianshoulist = qianshoulist;
            qianshoudanArr.push(cache_obj);
        })
        result.qianshoudanArr = qianshoudanArr;
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
    async lizhiyiban(ctx){
        let url = `${HR_URL}/flow/runtime/ViewIns.aspx?flowid=2310&instanceid=${ctx.request.body.unid}`;
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
            xm:$("span[id = 'F2_1_C13']").text(),
            bm:$("div[id = 'F2_1_C18']").text(),
            qjlx:$("span[id = 'F2_1_C5']").text(),
            kssj:$("span[id = 'F2_1_C20']").text(),
            dkcd:$("span[id = 'F2_1_C23']").text(),
            jqsm:$("xmp[id = 'F2_1_C26']").text(),
            tdrsm:$("xmp[id = 'F2_1_C17']").text(),

            gjlx:$("span[id = 'F2_1_C5']").text(),
            qjcd:$("span[id = 'F1_1_C32']").text(),
            dw:$("span[id = 'F1_1_C21']").text(),
        };
        if($("span[id = 'F2_1_C16']").length==0){
            result.zt = $("input[id = 'F2_1_C16']").val();
        }else{
            result.zt = $("span[id = 'F2_1_C16']").text();
        }
        if($("span[id = 'F2_1_C22']").length==0){
            result.jssj = $("input[id = 'F2_1_C22']").val();
        }else{
            result.jssj = $("span[id = 'F2_1_C22']").text();
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
        result.taskId = rs1.body.match(/InsObject.taskId        = \"(.*?)\"/)?rs1.body.match(/InsObject.taskId        = \"(.*?)\"/)[1]:'';
        result.instanceId = rs1.body.match(/InsObject.instanceId    = \"(.*?)\"/)?rs1.body.match(/InsObject.instanceId    = \"(.*?)\"/)[1]:'';
        result.slotId = rs1.body.match(/InsObject.slotId        = \"(.*?)\"/)?rs1.body.match(/InsObject.slotId        = \"(.*?)\"/)[1]:'';
        result.startTime = rs1.body.match(/InsObject.startTime = \'(.*?)\'/)?rs1.body.match(/InsObject.startTime = \'(.*?)\'/)[1]:'';
        result.dataVersion = rs1.body.match(/InsObject.dataVersion = \'(.*?)\'/)?rs1.body.match(/InsObject.dataVersion = \'(.*?)\'/)[1]:'';
        result.jPack = rs1.body.match(/window.jPack = (\{.*?});/)[1];
        let qianshoudanArr = [];//签收单
        $("div[class = 'subform'][style!='display:none'] table[class='multitable'] tbody").each((i,e1)=>{
            let cache_obj = {};
            cache_obj.displayflag = $(e1).attr('style');
            let qianshoulist = [];
            $(e1).find('tbody tr').each((index,e2)=>{
                let qianshou_obj = {};
                qianshou_obj.inputid = $(e2).find('td').eq(2).find('span').eq(0).text();
                qianshou_obj.spantext = $(e2).find('td').eq(0).find('span').eq(0).text();
                qianshou_obj.selectid = $(e2).find('td').eq(1).find('span').eq(0).text();
                let selectlist = [];
                $(e2).find('td').eq(1).find('select option').each((index1,e3)=>{
                    console.log($(e3).attr('selected')!=undefined)
                    selectlist.push({
                        optiontext:$(e3).text(),
                        optionvalue:$(e3).attr('value'),
                        optionselect:$(e3).attr('selected')!=undefined?"true":"false",
                    })
                })
                qianshou_obj.selectlist = selectlist;
                qianshoulist.push(qianshou_obj);
            })
            cache_obj.qianshoulist = qianshoulist;
            qianshoudanArr.push(cache_obj);
        })
        result.qianshoudanArr = qianshoudanArr;
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
};