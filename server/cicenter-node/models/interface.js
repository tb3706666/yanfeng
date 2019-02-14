// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;
const cheerio = require('cheerio');
module.exports = {
    async hlh_list(ctx){
        let rs = await fetch(`${OA_URL}/bizProp/griddatasInProc`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                page:ctx.request.body.pageNo,
                rows:20,
                csf:1,
            }
        });
        return JSON.parse(rs.body)
    },
    async hlh_chaoqi_list(ctx){
        let rs = await fetch(`${OA_URL}/bizProp/griddatasInProc?nowStatusId=8`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                page:ctx.request.body.pageNo,
                rows:20,
                csf:1,
            }
        });
        return JSON.parse(rs.body)
    },
    async hlh_other_list(ctx){
        let rs = await fetch(`${OA_URL}/bizPropProxy/griddatasInProc`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                page:ctx.request.body.pageNo,
                rows:20,
                csf:1,
            }
        });
        return JSON.parse(rs.body)
    },
    async hlh_detail(ctx){
        let {id,stepId,status} = ctx.request.body;
        let opereate = "";
        if(status===("20100") || status===("10000")){
            opereate = "edit";
        }else if(status===("20200") || status===("20202") || status===("20201")){
            opereate = "toAllocate";
        }else if(status===("20211") || status===("20210")){
            opereate = "toAllocateA";
        }else if(status===("30000") || status===("30100") || status===("30200")){
            opereate = "toAssess";
        }else if(status===("30500")){
            opereate = "toManager";
        }else if(status===("40000") || status===("40500")){
            opereate = "toImplemente";
        }else if(status===("50000")){
            opereate = "toVerify";
        }else if(status===("99999")){
            opereate = "toAllocate";
        }
        console.log("****************opereate==="+opereate+"-----------"+status);
        let url = `${OA_URL}/bizProp/${opereate}?id=${id}&stepId=${stepId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json = {},arr = [];
        //表单类型---区分页面结构不同
        json.opereate = opereate;
        //标题
        json.title = $("form table").find("tr").eq(0).find("th").eq(0).text().trim();
        //合理化编号
        json.hlhbh = $("form table").find("tr").eq(1).find("td").eq(1).text().trim();
        //合理化名称
        json.hlhmc = $("form table").find("tr").eq(2).find("td").eq(1).text().trim();
        //提出时间
        if($("form table").find("tr").eq(2).find("td").eq(3).find("br").length>0){
            json.tcsj = $("form table").find("tr").eq(2).find("td").eq(3).text().trim().split(' ')[0];
            json.tcsj2 = $("form table").find("tr").eq(2).find("td").eq(3).text().trim().split(' ')[1];
        }else{
            json.tcsj = $("form table").find("tr").eq(2).find("td").eq(3).text().trim();
        }
        //建议人 
        json.jyr = $("form table").find("tr").eq(3).find("td").eq(1).text().trim()
        //现状说明 
        json.xzsm = $("form table").find("tr").eq(4).find("td").eq(1).text().trim()
        //改进措施
        json.gjcs = $("form table").find("tr").eq(5).find("td").eq(1).text().trim()
        //建议实施人员
        let jyssryStr = $("form table").find("tr").eq(6).find("td").eq(1).text().trim();
        json.jyssry = jyssryStr;
        //合理化分类 
        json.hlhfl = $("form table").find("tr").eq(8).find("td").eq(1).text().trim()
        if(opereate === ("toAssess")){  //可行性评估
            //自提与一般流程结构不同,需区分
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(10).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssbm = $("form table").find("tr").eq(11).find("td").eq(1).text().trim();
                json.ssks = $("form table").find("tr").eq(11).find("td").eq(3).text().trim();
                json.ssr = $("form table").find("tr").eq(12).find("td").eq(1).text().trim();
                json.srry = $("form table").find("tr").eq(12).find("td").eq(3).text().trim();
            }else{
                //实施部门
                json.ssbm = $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks = $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr = $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry = $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
            }
        }else if(opereate===("toAllocate")){  //提出部门协调员分配
            //驳回后再提交的流程与一般流程结构不同,需区分
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyjInfo = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
            }
            //合理化分类选择
            let fenlei_arr =  [];
            $("select[id='ptId'] option").each((i,e)=>{
                fenlei_arr.push({
                    text:$(e).text(),
                    value:$(e).attr('value')
                });
            })
            json.fenleiInfo = fenlei_arr;
            //通过实施人员id取实施人员资料
            let personId = $("input[id='aempId']").val();
            let match = /url:\"\/CICenter\/plugin\/buildOrgSelectedTree\"\+\"\?isFileterSect=1&nodelevelId=\"\+\"(\d*)\"/.exec(rs.body);
            let deptId = match[1];
            json.deptId = deptId;
            let depts_urlzzb = `${OA_URL}/plugin/buildOrgSelectedTree?isFileterSect=1&nodelevelId=${deptId}`;
            let depts = await fetch(depts_urlzzb, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let regex1 = new RegExp(`.*?\\"id\\":\\"${deptId}\\".*?text\\":\\"(.*?)\\".*`,"g")
            match = regex1.exec(depts.body);
            //实施部门
            json.depts = match[1];
            //科室
            let ssryks_url = `${OA_URL}/plugin/getSects?parentId=${deptId}`;
            //人员
            let ssry_url = `${OA_URL}/plugin/getEmpInfos?isConvertToCode=0&isHaveAcc=0&organizationCode=`+$("input[id='asectId']").val();
            let ssryks = await fetch(ssryks_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let ssry = await fetch(ssry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            json.ssryks = $("input[id='asectId']").val();
            json.ssryksInfo = JSON.parse(ssryks.body);
            json.ssry = $("input[id='asectId']").val();
            json.ssryInfo = JSON.parse(ssry.body);
        }else if(opereate===("toAllocateA")){  //提出部门协调员分配
            let jyssry_id = "";
            if(jyssryStr!=("")){
                let jarr1 = jyssryStr.split("/");
                jyssry_id = jarr1[1];
                // let jyssryStrNew = "";
                // for(let i=0;i<jarr1.length;i++){
                //     let str = jarr1[i];
                //     jyssryStrNew = jyssryStrNew + str.trim() + "/";
                // }
                // json.jyssry = jyssryStrNew.substring(0, jyssryStrNew.length()-1)
            }
            //提出部门协调员意见
            json.tcbmxtyyjInfo = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                return item!=''
            }).map(item=>{
                return {
                    text:item
                }
            });
            $("form table tr").each((i,e)=>{
                if($(e).find("td").eq(0).text().indexOf('实施部门协调员意见')>-1){
                    //实施部门协调员意见
                    json.ssbmyjInfo = $(e).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                        return item!=''
                    }).map(item=>{
                        return {
                            text:item
                        }
                    });
                }
                if($(e).find("td").eq(0).text().indexOf('实施人员可行性评估')>-1){
                    json.ssryyjInfo = $(e).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                        return item!=''
                    }).map(item=>{
                        return {
                            text:item
                        }
                    });
                }
                if($(e).find("td").eq(0).text().indexOf('直接经理可行性评估')>-1){
                    json.zjjlyjInfo = $(e).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                        return item!=''
                    }).map(item=>{
                        return {
                            text:item
                        }
                    });
                }
            });
            //取实施人员信息
            let searchPerson = await fetch(`${OA_URL}/plugin/getEmpInfos?isConvertToCode=1&isHaveAcc=0&organizationCode=-1`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                form:{
                    q:jyssry_id
                }
            });
            let personXml = JSON.parse(searchPerson.body);
            let sectId= personXml[0].sectId;
            let ssry_url = `${OA_URL}/plugin/getEmpInfos?organizationCode=${sectId}`;
            let xxlry_url = `${OA_URL}/plugin/getEmpInfos?organizationCode=${sectId}&isHaveAcc=1`;
            let aempIdsflag = /\$\('#aempId'\).combobox[\s\S]*?url:'(.*?)'/.exec(rs.body)[1];
            console.log(aempIdsflag);
            if(aempIdsflag.indexOf("getEmpInfos")>-1){
                ssry_url=`${OA_URL}/`+aempIdsflag.split("CICenter/")[1];
            }
            let cempIdsflag = /\$\('#cempId'\).combobox[\s\S]*?url:'(.*?)'/.exec(rs.body)[1];
            console.log(cempIdsflag);
            if(cempIdsflag.indexOf("getEmpInfos")>-1){
                xxlry_url=`${OA_URL}/`+cempIdsflag.split("CICenter/")[1];
            }
            let ssryXml = await fetch(ssry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let xxlryXml = await fetch(xxlry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            json.ssryInfo = JSON.parse(ssryXml.body);
            json.xxlryInfo = JSON.parse(xxlryXml.body);
        }else if(opereate===("toImplemente")){  //实施中
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssbm = $("form table").find("tr").eq(10).find("td").eq(1).text().trim();
                json.ssks = $("form table").find("tr").eq(10).find("td").eq(3).text().trim();
                json.ssr = $("form table").find("tr").eq(11).find("td").eq(1).text().trim();
                json.srry = $("form table").find("tr").eq(11).find("td").eq(3).text().trim();
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(12).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(13).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
            }else{//自提
                //实施部门
                json.ssbm =  $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks =  $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                //实施人员可行性评估 
                let ssrypg_arr = [];
                let text = $("form table").find("tr").eq(11).find("td").eq(1).html().trim()
                ssrypg_arr = text.split("<br>").map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssrykxxpg = ssrypg_arr;
            }
        }else if(opereate===("toVerify")){  //实施报告验证
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                 //实施部门
                 json.ssbm =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                 //实施科室
                 json.ssks =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                 //实施人 
                 json.ssr =  $("form table").find("tr").eq(11).find("td").eq(1).text().trim()
                 //输入人员 
                 json.srry =  $("form table").find("tr").eq(11).find("td").eq(3).text().trim()
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(12).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(13).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.wcrq =  $("form table").find("tr").eq(14).find("td").eq(1).text().trim();
                json.gjcs =  $("form table").find("tr").eq(15).find("td").eq(1).text().trim();
                json.gjxg =  $("form table").find("tr").eq(16).find("td").eq(1).text().trim();
                json.jyje =  $("form table").find("tr").eq(17).find("td").eq(1).text().trim();
                json.jyjejsff =  $("form table").find("tr").eq(18).find("td").eq(1).text().trim();
                json.bgkyzrq =  $("form table").find("tr").eq(21).find("td").eq(1).text().trim();
                //实施人员可行性评估 
                json.sybgyz = $("form table").find("tr").eq(20).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //附件数组22222
                let file_arr2 = [];
                $("form table").find("tr").eq(19).find("td").eq(1).find("a").each((i,e)=>{
                    let href = $(e).attr("href");
                    let attachSeriNo = href.substring(href.indexOf('=')+1);
                    file_arr2.push({
                        fileName:$(e).text().trim(),
                        attachSeriNo:attachSeriNo
                    })
                })
                json.fileInfo2 = file_arr2;
                //合理化分类选择
                let fenlei_arr =  [];
                $("select[id='ptId'] option").each((i,e)=>{
                    fenlei_arr.push({
                        text:$(e).text(),
                        value:$(e).attr('value')
                    });
                })
                json.fenleiInfo = fenlei_arr;
                //奖项等级
                let bonus_arr = [];
                $("select[id='bonusClassId'] option").each((i,e)=>{
                    bonus_arr.push({
                        text:$(e).text(),
                        value:$(e).attr('value')
                    });
                })
                json.bonusInfo = bonus_arr;
            }else{
                //实施部门
                json.ssbm =  $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks =  $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(11).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.wcrq =  $("form table").find("tr").eq(12).find("td").eq(1).text().trim();
                json.gjcs =  $("form table").find("tr").eq(13).find("td").eq(1).text().trim();
                json.gjxg =  $("form table").find("tr").eq(14).find("td").eq(1).text().trim();
                json.jyje =  $("form table").find("tr").eq(15).find("td").eq(1).text().trim();
                json.jyjejsff =  $("form table").find("tr").eq(16).find("td").eq(1).text().trim();
                 //附件数组22222
                 let file_arr2 = [];
                 $("form table").find("tr").eq(17).find("td").eq(1).find("a").each((i,e)=>{
                     let href = $(e).attr("href");
                     let attachSeriNo = href.substring(href.indexOf('=')+1);
                     file_arr2.push({
                         fileName:$(e).text().trim(),
                         attachSeriNo:attachSeriNo
                     })
                 })
                 json.fileInfo2 = file_arr2;
                 //实验报告验证
                 json.sybgyz = $("form table").find("tr").eq(18).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //报告可验证日期  
                json.bgkyzrq =  $("form table").find("tr").eq(19).find("td").eq(1).text().trim();
                //合理化分类选择
                let fenlei_arr =  [];
                $("select[id='ptId'] option").each((i,e)=>{
                    if($(e).attr('value') ==''){
                        fenlei_arr.push({
                            text:'',
                            value:''
                        });
                    }else{
                        fenlei_arr.push({
                            text:$(e).text(),
                            value:$(e).attr('value')
                        });
                    }
                })
                json.fenleiInfo = fenlei_arr;
                 //奖项等级
                 let bonus_arr = [];
                 $("select[id='bonusClassId'] option").each((i,e)=>{
                     bonus_arr.push({
                         text:$(e).text(),
                         value:$(e).attr('value')
                     });
                 })
                 json.bonusInfo = bonus_arr;
            }
        }

        //附件数组
        let file_arr = [];
        $("form table").find("tr").eq(7).find("td").eq(1).find("a").each((i,e)=>{
            let href = $(e).attr("href");
            let attachSeriNo = href.substring(href.indexOf('=')+1);
            file_arr.push({
                fileName:$(e).text().trim(),
                attachSeriNo:attachSeriNo
            })
        })
        json.fileInfo = file_arr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr("name"),
                value:$(e).attr("value"),
            })
        })
        json.hideInfo = hide_arr;
        let button_arr = [];
        let pos = 1;
        $("div[class='button'] input[value != '返回']").each((i,e)=>{
            let list = {};
            if($(e).attr("value").trim() === ("提交")){
                list.onclick="doSubmit()";
            }else{
                list.onclick=$(e).attr("onclick");
            }
            let regex1 = new RegExp(`\\$\\('#bt0${pos}'\\)[^\\"]*\\"([^\\"]*)\\"`,"g");
            regex1.test(rs.body)
            let tips = RegExp.$1;
            let text = $(e).attr("value").trim();
            text = text+"("+tips+")";
            list.text =text;
            button_arr.push(list)
            pos++;
        })
        json.buttonInfo = button_arr;
        return json;
    },
    async hlh_add(ctx){
        let url = `${OA_URL}/bizProp/create`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                P_FUNC_ID:"",
                csf:1,
                newAgain:1
            }
        });
        let $ = jqlite(rs.body);
        let json = {
            propDate:$("input[id='propDate']").val(),
            pempMtel:$("input[id='pempMtel']").val(),
        };
        //合理化分类
        let fenlei_arr = [];
        $("select[id='ptId'] option").each((i,e)=>{
            fenlei_arr.push({
                text:$(e).text().trim(),
                value:$(e).attr('value')
            })
        })
        json.hlh_fenlei = fenlei_arr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr('name'),
                value:$(e).attr('value')
            })
        })
        json.hideInfo = hide_arr;
        return json;
    },
    async upload(ctx){
        const formData = {
            Filename:ctx.request.body.Filename,
            seriId:ctx.request.body.seriId,
            addtType:ctx.request.body.addtType,
            Upload:ctx.request.body.Upload,
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
        let rs = await fetch(`${OA_URL}/bizProp/upload`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            formData:formData
        });
        return JSON.parse(rs.body);
    },
    async deleteAddt(ctx){
        let url = `${OA_URL}/bizProp/deleteAddt?attachSeriNo=${ctx.request.query.attachSeriNo}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        return {}
    },
    //新建提交
    async createSubmit(ctx){
        let url = `${OA_URL}/bizProp/createSubmit`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let $ = jqlite(rs.body);
        let reuslt = $("div[id='operateRsResult'] div span").text().trim();
        let json = {};
        if(reuslt===("操作成功 !")){
            json.result="success";
        }else{
            json.result="failed";
            json.msg=$("div[class='error_info'] p").text().trim();
        }
        return json;
    },
    async search(ctx){
        let {key,deptId} = ctx.request.body;
        if(!deptId||deptId===("")){
            deptId = "-1";
        }
        let url = `${OA_URL}/plugin/getEmpInfos?isConvertToCode=1&isHaveAcc=0&organizationCode=${deptId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                q:key
            }
        });
        return {
            list:JSON.parse(rs.body)
        }
    },
    async hlh_query_init(ctx){
        let url = `${OA_URL}/bizPropQuery/inProcLst`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                P_FUNC_ID:"",
                csf:1,
                newAgain:1
            }
        });
        let $ = jqlite(rs.body);
        return {
            propName:$("input[id='propName']").val(),
            propDateS:$("input[id='propDateS']").val(),
            propDateE:$("input[id='propDateE']").val(),
        }
    },
    async griddatasInProc(ctx){
        let url = `${OA_URL}/bizPropQuery/griddatasInProc`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let result = JSON.parse(rs.body);
        return{
            rows:result.rows,
            total:result.total,
            pageNo:result.page,
        }
    },
    async hlh_query_detail(ctx){
        let url = `${OA_URL}/bizProp/view?seriId=${ctx.request.query.seriId}&closeFlag=1&excel=1&noData=0`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json_arr = [];
        $("form table tr").filter(i=>i>0).each((i,e)=>{
            let list = {};
            if($(e).find("td").length==4){
                list.name = $(e).find("td").eq(0).text().trim();
                let tdArray = [];
                if($(e).find("td").eq(1).find("a").length>0){
                    $(e).find("td").eq(1).find("a").each((i1,e1)=>{
                        let href = $(e1).attr("href");
                        let attachSeriNo = href.substring(href.indexOf('=')+1);
                        tdArray.push({
                            fileName:$(e1).text().trim(),
                            attachSeriNo:attachSeriNo,
                            fileFlag:1
                        })
                    })
                }else{
                    tdArray.push({
                        text:$(e).find("td").eq(1).text().trim()
                    })
                }
                list.value = tdArray;
                json_arr.push(list);
                list = {};
                tdArray = [];
                list.name =  $(e).find("td").eq(2).text().trim();
                tdArray.push({
                    text:$(e).find("td").eq(3).text().trim()
                })
                list.value = tdArray;
                json_arr.push(list);
                
            }else{
                list.name = $(e).find("td").eq(0).text().trim();
                let tdArray = [];
                if($(e).find("td").eq(1).find("a").length>0){
                    $(e).find("td").eq(1).find("a").each((i1,e1)=>{
                        let href = $(e1).attr("href");
                        let attachSeriNo = href.substring(href.indexOf('=')+1);
                        tdArray.push({
                            fileName:$(e1).text().trim(),
                            attachSeriNo:attachSeriNo,
                            fileFlag:1
                        })
                    })
                }else{
                    $(e).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                        return item!=''
                    }).forEach((item)=>{
                        tdArray.push({
                            text:item.trim()
                        })
                    })
                }
                list.value = tdArray;
                json_arr.push(list)
            }
        })
        return {
            list:json_arr,
            title:$("form table tr th").text().trim()
        }
    },
    async download(ctx){
        let rs = await fetch(`${OA_URL}/bizProp/download?attachSeriNo=${ctx.query.attachSeriNo}`, {
            ctx: ctx,
            method: 'get',
            headers: {
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },function(){});
        return rs;
    },
    async hlh_deal_init(ctx){
        let url = `${OA_URL}/bizPropMyDealWith/inProcLst`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                P_FUNC_ID:"",
                csf:1,
                newAgain:1
            }
        });
        let $ = jqlite(rs.body);
        return {
            propName:$("input[id='propName']").val(),
            propDateS:$("input[id='propDateS']").val(),
            propDateE:$("input[id='propDateE']").val(),
        }
    },
    async SelectList(ctx){
        let url = `${OA_URL}/bizPropMyDealWith/griddatasInProc`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let result = JSON.parse(rs.body);
        return{
            rows:result.rows,
            total:result.total,
            pageNo:result.page,
        }
    },
    async hlh_credit_init(ctx){
        let url = `${OA_URL}/bizCreditQuery/inProcLst`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                P_FUNC_ID:"",
                csf:1,
                newAgain:1
            }
        });
        let $ = jqlite(rs.body);
        return {
            propName:$("input[id='propName']").val(),
            propDateS:$("input[id='propDateS']").val(),
            propDateE:$("input[id='propDateE']").val(),
        }
    },
    async jifenList(ctx){
        let url = `${OA_URL}/bizCreditQuery/griddatasInProc`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.query
        });
        let result = JSON.parse(rs.body);
        return{
            rows:result.rows,
            total:result.total,
            pageNo:result.page,
        }
    },
    async buildOrgSelectedTree(ctx){
        let {id,nodelevelId} = ctx.query;
        if(!id){
            id="";
        }
        if(!nodelevelId){
            nodelevelId="";
        }
        let url = `${OA_URL}/plugin/buildOrgSelectedTree?nodelevelId=${nodelevelId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                id:id
            }
        });
        return JSON.parse(rs.body);
    },
    async buildOrgSelectedTree1(ctx){
        let {id,nodelevelId} = ctx.query;
        if(!id){
            id="";
        }
        if(!nodelevelId){
            nodelevelId="";
        }
        let url = `${OA_URL}/plugin/buildOrgSelectedTree?isFileterSect=1&nodelevelId=${nodelevelId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                id:id
            }
        });
        return JSON.parse(rs.body);
    },
    async oaSubmit(ctx){
        let path = ctx.url.substr(ctx.url.lastIndexOf('/')+1)
        let url = `${OA_URL}/bizProp/${path}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let $ = jqlite(rs.body);
        let reuslt = $("div[id='operateRsResult'] div span").text().trim();
        let json = {};
        if(reuslt===("操作成功 !")){
            json.result="success";
        }else{
            json.result="failed";
            json.msg=$("div[class='error_info'] p").text().trim();
        }
        return json;
    },
    async hlh_edit(ctx){
        let {id,stepId,status} = ctx.request.body;
        let url = `${OA_URL}/bizProp/edit?id=${id}&stepId=${stepId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json = {
            propName:$("input[id='propName']").val(),
            propDate:$("input[id='propDate']").val(),
            pempMtel:$("input[id='pempMtel']").val(),
            propActu:$("input[id='propActu']").val(),
            propMeas:$("input[id='propMeas']").val(),
            recAempId:$("input[id='recAempId']").val(),
        };
        //合理化分类
        let fenlei_arr =  [];
        $("select[id='ptId'] option").each((i,e)=>{
            fenlei_arr.push({
                text:$(e).text().trim(),
                value:$(e).attr('value')
            });
        })
        json.hlh_fenlei = fenlei_arr;
        //提出部门协调员意见
        json.tcbmxtyyj = $("form table").find("tr").eq(6).find("td").eq(1).html().trim().split("<br>").filter(item=>{
            return item!=''
        }).map(item=>{
            return {
                text:item
            }
        });
        //附件数组
        let file_arr = [];
        $("table[id='attachtdownload'] tr").each((i,e)=>{
            let trId = $(e).attr("id");
            file_arr.push({
                filename:$(e).find('td').eq(0).text().trim(),
                attachSeriNo:trId.substring(7)
            })
        })
        json.fileList = file_arr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr("name"),
                value:$(e).attr("value"),
            })
        })
        json.hideInfo = hide_arr;
        return json;
    },
    async hlh_eval_init(ctx){
        let url = `${OA_URL}/bizEvalGrant/index`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:{
                P_FUNC_ID:"",
                csf:1,
                newAgain:1
            }
        });
        let $ = jqlite(rs.body);
        return {
            propName:$("input[id='propName']").val(),
            propDateS:$("input[id='propDateS']").val(),
            propDateE:$("input[id='propDateE']").val(),
        }
    },
    async EvalList(ctx){
        let url = `${OA_URL}/bizEvalGrant/griddatasInProc`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let result = JSON.parse(rs.body);
        return{
            rows:result.rows,
            total:result.total,
            pageNo:result.page,
        }
    },
    async hlh_eval_detail(ctx){
        let url = `${OA_URL}/bizEvalGrant/toGrant?seriId=${ctx.request.query.seriId}&closeFlag=1&excel=1&noData=0`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json_arr = [];
        let trs =  $("form table tbody").eq(0).children("tr");
        trs.filter(i=>(i>0&&i<(trs.length-6))).each((i,e)=>{
            let list = {};
            if($(e).find("td").length==4){
                list.name = $(e).find("td").eq(0).text().trim();
                let tdArray = [];
                if($(e).find("td").eq(1).find("a").length>0){
                    $(e).find("td").eq(1).find("a").each((i1,e1)=>{
                        let href = $(e1).attr("href");
                        let attachSeriNo = href.substring(href.indexOf('=')+1);
                        tdArray.push({
                            fileName:$(e1).text().trim(),
                            attachSeriNo:attachSeriNo,
                            fileFlag:1
                        })
                    })
                }else{
                    tdArray.push({
                        text:$(e).find("td").eq(1).text().trim()
                    })
                }
                list.value = tdArray;
                json_arr.push(list);
                list = {};
                tdArray = [];
                list.name =  $(e).find("td").eq(2).text().trim();
                tdArray.push({
                    text:$(e).find("td").eq(3).text().trim()
                })
                list.value = tdArray;
                json_arr.push(list);
            }else{
                list.name = $(e).find("td").eq(0).text().trim();
                let tdArray = [];
                if($(e).find("td").eq(1).find("a").length>0){
                    $(e).find("td").eq(1).find("a").each((i1,e1)=>{
                        let href = $(e1).attr("href");
                        let attachSeriNo = href.substring(href.indexOf('=')+1);
                        tdArray.push({
                            fileName:$(e1).text().trim(),
                            attachSeriNo:attachSeriNo,
                            fileFlag:1
                        })
                    })
                }else{
                    $(e).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                        return item!=''
                    }).forEach((item)=>{
                        tdArray.push({
                            text:item.trim()
                        })
                    })
                    // //todo
                    // tdArray.push({
                    //     text:$(e).find("td").eq(1).text().trim()
                    // })
                    // json.tcbmxtyyjInfo = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    //     return item!=''
                    // }).map(item=>{
                    //     return {
                    //         text:item
                    //     }
                    // });
                }
                list.value = tdArray;
                json_arr.push(list)
            }
       
        });
        let json =  {
            list:json_arr,
            title:$("form table tr th").text().trim(),
            propActMeas:$("textarea[id='propActMeas']").val(),
            propEffe:$("textarea[id='propEffe']").val(),
            costSaveAmt:$("input[id='costSaveAmt']").val(),
            costSaveType:$("input[name='costSaveType'][checked]").val(),
            costSaveNote:$("textarea[id='costSaveNote']").val(),
            bonusValue:$("select[id='bonusClassId'] option[selected]").val(),
        };
        //奖项等级
        let bonusArr = [];
        $("select[id='bonusClassId'] option").each((i,e)=>{
            bonusArr.push({
                value:$(e).attr('value'),
                text:$(e).text().trim(),
            })
        })
        json.bonusInfo = bonusArr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr("name"),
                value:$(e).attr("value"),
            })
        })
        json.hideInfo = hide_arr;
        return json;
    },
    async toGrantSubmit(ctx){
        let url = `${OA_URL}/bizEvalGrant/toGrantSubmit`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form:ctx.request.body
        });
        let $ = jqlite(rs.body);
        let reuslt = $("div[id='operateRsResult'] div span").text().trim();
        let json = {};
        if(reuslt===("操作成功 !")){
            json.result="success";
        }else{
            json.result="failed";
            json.msg=$("div[class='error_info'] p").text().trim();
        }
        return json;
    },
    async getSects(ctx){
        let url = `${OA_URL}/plugin/getSects?parentId=${ctx.request.body.parentId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let result = JSON.parse(rs.body);
        return result
    },
    async getEmpInfos(ctx){
        let url = `${OA_URL}/plugin/getEmpInfos?isConvertToCode=0&isHaveAcc=0&organizationCode=${ctx.query.organizationCode}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let result = JSON.parse(rs.body);
        return result
    },
    async hlh_other_detail(ctx){
        let {id,stepId,status} = ctx.request.body;
        let opereate = "";
        if(status===("20100") || status===("10000")){
            opereate = "edit";
        }else if(status===("20200") || status===("20202") || status===("20201")){
            opereate = "toAllocate";
        }else if(status===("20211") || status===("20210")){
            opereate = "toAllocateA";
        }else if(status===("30000") || status===("30100") || status===("30200")){
            opereate = "toAssess";
        }else if(status===("30500")){
            opereate = "toManager";
        }else if(status===("40000") || status===("40500")){
            opereate = "toImplemente";
        }else if(status===("50000")){
            opereate = "toVerify";
        }else if(status===("99999")){
            opereate = "toAllocate";
        }
        console.log("****************opereate==="+opereate+"-----------"+status);
        let url = `${OA_URL}/bizProp/${opereate}?isProxyeda=1&id=${id}&stepId=${stepId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json = {},arr = [];
        //表单类型---区分页面结构不同
        json.opereate = opereate;
        //标题
        json.title = $("form table").find("tr").eq(0).find("th").eq(0).text().trim();
        //合理化编号
        json.hlhbh = $("form table").find("tr").eq(1).find("td").eq(1).text().trim();
        //合理化名称
        json.hlhmc = $("form table").find("tr").eq(2).find("td").eq(1).text().trim();
        //提出时间
        if($("form table").find("tr").eq(2).find("td").eq(3).find("br").length>0){
            json.tcsj = $("form table").find("tr").eq(2).find("td").eq(3).text().trim().split(' ')[0];
            json.tcsj2 = $("form table").find("tr").eq(2).find("td").eq(3).text().trim().split(' ')[1];
        }else{
            json.tcsj = $("form table").find("tr").eq(2).find("td").eq(3).text().trim();
        }
        //建议人 
        json.jyr = $("form table").find("tr").eq(3).find("td").eq(1).text().trim()
        //现状说明 
        json.xzsm = $("form table").find("tr").eq(4).find("td").eq(1).text().trim()
        //改进措施
        json.gjcs = $("form table").find("tr").eq(5).find("td").eq(1).text().trim()
        //建议实施人员
        let jyssryStr = $("form table").find("tr").eq(6).find("td").eq(1).text().trim();
        json.jyssry = jyssryStr;
        //合理化分类 
        json.hlhfl = $("form table").find("tr").eq(8).find("td").eq(1).text().trim()
        if(opereate === ("toAssess")){  //可行性评估
            //自提与一般流程结构不同,需区分
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(10).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssbm = $("form table").find("tr").eq(11).find("td").eq(1).text().trim();
                json.ssks = $("form table").find("tr").eq(11).find("td").eq(3).text().trim();
                json.ssr = $("form table").find("tr").eq(12).find("td").eq(1).text().trim();
                json.srry = $("form table").find("tr").eq(12).find("td").eq(3).text().trim();
            }else{
                //实施部门
                json.ssbm = $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks = $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr = $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry = $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
            }
        }else if(opereate===("toAllocate")){  //提出部门协调员分配
            //驳回后再提交的流程与一般流程结构不同,需区分
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyjInfo = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
            }
            //合理化分类选择
            let fenlei_arr =  [];
            $("select[id='ptId'] option").each((i,e)=>{
                fenlei_arr.push({
                    text:$(e).text(),
                    value:$(e).attr('value')
                });
            })
            json.fenleiInfo = fenlei_arr;
            //通过实施人员id取实施人员资料
            let personId = $("input[id='aempId']").val();
            let deptId = "";
            if(personId===("")){
                deptId = /url:\"\/CICenter\/plugin\/buildOrgSelectedTree\"\+\"\?isFileterSect=1&nodelevelId=\"\+\"(\d*)\"/.exec(rs.body)[1];
                let jyrStr =  $("form table").find("tr").eq(3).find("td").eq(1).text().trim();
                let jyrArr = jyrStr.split("/");
                json.depts = jyrArr[3];
                json.deptId = deptId;
            }else{
                let searchPerson = await fetch(`${OA_URL}/plugin/getEmpInfos?isConvertToCode=1&isHaveAcc=0&organizationCode=-1`, {
                    ctx: ctx,
                    method: 'post',
                    headers: {
                        "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                    },
                    form:{
                        q:personId
                    }
                });
                let personXml = JSON.parse(searchPerson.body);
                deptId = personXml[0].deptId;
                json.depts = personXml[0].depts;
                json.deptId = deptId;
                json.sects = personXml[0].sects;

            }

            //科室
            let ssryks_url = `${OA_URL}/plugin/getSects?parentId=${deptId}`;
            //人员
            let ssry_url = `${OA_URL}/plugin/getEmpInfos?isConvertToCode=0&isHaveAcc=0&organizationCode=`+$("input[id='asectId']").val();
            let ssryks = await fetch(ssryks_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let ssry = await fetch(ssry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            json.ssryks = $("input[id='asectId']").val();
            json.ssryksInfo = JSON.parse(ssryks.body);
            json.ssry = $("input[id='asectId']").val();
            json.ssryInfo = JSON.parse(ssry.body);
        }else if(opereate===("toAllocateA")){  //提出部门协调员分配
            let jarr1 = jyssryStr.split("/");
            let jyssry_id = jarr1[1];
           
            //提出部门协调员意见
            json.tcbmxtyyjInfo = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                return item!=''
            }).map(item=>{
                return {
                    text:item
                }
            });
            //取实施人员信息
            let searchPerson = await fetch(`${OA_URL}/plugin/getEmpInfos?isConvertToCode=1&isHaveAcc=0&organizationCode=-1`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                form:{
                    q:jyssry_id
                }
            });
            let personXml = JSON.parse(searchPerson.body);
            let sectId= personXml[0].sectId;
            let ssry_url = `${OA_URL}/plugin/getEmpInfos?organizationCode=${sectId}`;
            let xxlry_url = `${OA_URL}/plugin/getEmpInfos?organizationCode=${sectId}&isHaveAcc=1`;
            let aempIdsflag = /\$\('#aempId'\).combobox[\s\S]*?url:'(.*?)'/.exec(rs.body)[1];
            console.log(aempIdsflag);
            if(aempIdsflag.indexOf("getEmpInfos")>-1){
                ssry_url=`${OA_URL}/`+aempIdsflag.split("CICenter/")[1];
            }
            let cempIdsflag = /\$\('#cempId'\).combobox[\s\S]*?url:'(.*?)'/.exec(rs.body)[1];
            console.log(cempIdsflag);
            if(cempIdsflag.indexOf("getEmpInfos")>-1){
                xxlry_url=`${OA_URL}/`+cempIdsflag.split("CICenter/")[1];
            }
            let ssryXml = await fetch(ssry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            let xxlryXml = await fetch(xxlry_url, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
            });
            json.ssryInfo = JSON.parse(ssryXml.body);
            json.xxlryInfo = JSON.parse(xxlryXml.body);
        }else if(opereate===("toImplemente")){  //实施中
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssbm = $("form table").find("tr").eq(10).find("td").eq(1).text().trim();
                json.ssks = $("form table").find("tr").eq(10).find("td").eq(3).text().trim();
                json.ssr = $("form table").find("tr").eq(11).find("td").eq(1).text().trim();
                json.srry = $("form table").find("tr").eq(11).find("td").eq(3).text().trim();
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(12).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(13).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
            }else{//自提
                //实施部门
                json.ssbm =  $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks =  $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                //实施人员可行性评估 
                let ssrypg_arr = [];
                let text = $("form table").find("tr").eq(11).find("td").eq(1).html().trim()
                ssrypg_arr = text.split("<br>").map(item=>{
                    return {
                        text:item
                    }
                });
                json.ssrykxxpg = ssrypg_arr;
            }
        }else if(opereate===("toVerify")){  //实施报告验证
            if($("form table").find("tr").eq(9).find("td").eq(0).text().trim() === '提出部门协调员意见'){
                json.yjflag ="1";
                //提出部门协调员意见
                json.tcbmxtyyj = $("form table").find("tr").eq(9).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                 //实施部门
                 json.ssbm =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                 //实施科室
                 json.ssks =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                 //实施人 
                 json.ssr =  $("form table").find("tr").eq(11).find("td").eq(1).text().trim()
                 //输入人员 
                 json.srry =  $("form table").find("tr").eq(11).find("td").eq(3).text().trim()
                //实施部门协调员意见
                json.ssbmxtyyj = $("form table").find("tr").eq(12).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(13).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.wcrq =  $("form table").find("tr").eq(14).find("td").eq(1).text().trim();
                json.gjcs =  $("form table").find("tr").eq(15).find("td").eq(1).text().trim();
                json.gjxg =  $("form table").find("tr").eq(16).find("td").eq(1).text().trim();
                json.jyje =  $("form table").find("tr").eq(17).find("td").eq(1).text().trim();
                json.jyjejsff =  $("form table").find("tr").eq(18).find("td").eq(1).text().trim();
                json.bgkyzrq =  $("form table").find("tr").eq(21).find("td").eq(1).text().trim();
                //实施人员可行性评估 
                json.sybgyz = $("form table").find("tr").eq(20).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //附件数组22222
                let file_arr2 = [];
                $("form table").find("tr").eq(19).find("td").eq(1).find("a").each((i,e)=>{
                    let href = $(e).attr("href");
                    let attachSeriNo = href.substring(href.indexOf('=')+1);
                    file_arr2.push({
                        fileName:$(e).text().trim(),
                        attachSeriNo:attachSeriNo
                    })
                })
                json.fileInfo2 = file_arr2;
                //合理化分类选择
                let fenlei_arr =  [];
                $("select[id='ptId'] option").each((i,e)=>{
                    fenlei_arr.push({
                        text:$(e).text(),
                        value:$(e).attr('value')
                    });
                })
                json.fenleiInfo = fenlei_arr;
                //奖项等级
                let bonus_arr = [];
                $("select[id='bonusClassId'] option").each((i,e)=>{
                    bonus_arr.push({
                        text:$(e).text(),
                        value:$(e).attr('value')
                    });
                })
                json.bonusInfo = bonus_arr;
            }else{
                //实施部门
                json.ssbm =  $("form table").find("tr").eq(9).find("td").eq(1).text().trim()
                //实施科室
                json.ssks =  $("form table").find("tr").eq(9).find("td").eq(3).text().trim()
                //实施人 
                json.ssr =  $("form table").find("tr").eq(10).find("td").eq(1).text().trim()
                //输入人员 
                json.srry =  $("form table").find("tr").eq(10).find("td").eq(3).text().trim()
                //实施人员可行性评估 
                json.ssrykxxpg = $("form table").find("tr").eq(11).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                json.wcrq =  $("form table").find("tr").eq(12).find("td").eq(1).text().trim();
                json.gjcs =  $("form table").find("tr").eq(13).find("td").eq(1).text().trim();
                json.gjxg =  $("form table").find("tr").eq(14).find("td").eq(1).text().trim();
                json.jyje =  $("form table").find("tr").eq(15).find("td").eq(1).text().trim();
                json.jyjejsff =  $("form table").find("tr").eq(16).find("td").eq(1).text().trim();
                 //附件数组22222
                 let file_arr2 = [];
                 $("form table").find("tr").eq(17).find("td").eq(1).find("a").each((i,e)=>{
                     let href = $(e).attr("href");
                     let attachSeriNo = href.substring(href.indexOf('=')+1);
                     file_arr2.push({
                         fileName:$(e).text().trim(),
                         attachSeriNo:attachSeriNo
                     })
                 })
                 json.fileInfo2 = file_arr2;
                 //实验报告验证
                 json.sybgyz = $("form table").find("tr").eq(18).find("td").eq(1).html().trim().split("<br>").filter(item=>{
                    return item!=''
                }).map(item=>{
                    return {
                        text:item
                    }
                });
                //报告可验证日期  
                json.bgkyzrq =  $("form table").find("tr").eq(19).find("td").eq(1).text().trim();
                //合理化分类选择
                let fenlei_arr =  [];
                $("select[id='ptId'] option").each((i,e)=>{
                    if($(e).attr('value') ==''){
                        fenlei_arr.push({
                            text:'',
                            value:''
                        });
                    }else{
                        fenlei_arr.push({
                            text:$(e).text(),
                            value:$(e).attr('value')
                        });
                    }
                })
                json.fenleiInfo = fenlei_arr;
                 //奖项等级
                 let bonus_arr = [];
                 $("select[id='bonusClassId'] option").each((i,e)=>{
                     bonus_arr.push({
                         text:$(e).text(),
                         value:$(e).attr('value')
                     });
                 })
                 json.bonusInfo = bonus_arr;
            }
        }

        //附件数组
        let file_arr = [];
        $("form table").find("tr").eq(7).find("td").eq(1).find("a").each((i,e)=>{
            let href = $(e).attr("href");
            let attachSeriNo = href.substring(href.indexOf('=')+1);
            file_arr.push({
                fileName:$(e).text().trim(),
                attachSeriNo:attachSeriNo
            })
        })
        json.fileInfo = file_arr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr("name"),
                value:$(e).attr("value"),
            })
        })
        json.hideInfo = hide_arr;
        let button_arr = [];
        let pos = 1;
        $("div[class='button'] input[value != '返回']").each((i,e)=>{
            let list = {};
            if($(e).attr("value").trim() === ("提交")){
                list.onclick="doSubmit()";
            }else{
                list.onclick=$(e).attr("onclick");
            }
            let regex1 = new RegExp(`\\$\\('#bt0${pos}'\\)[^\\"]*\\"([^\\"]*)\\"`,"g");
            regex1.test(rs.body)
            let tips = RegExp.$1;
            let text = $(e).attr("value").trim();
            text = text+"("+tips+")";
            list.text =text;
            button_arr.push(list)
            pos++;
        })
        json.buttonInfo = button_arr;
        return json;
    },
    async hlh_other_edit(ctx){
        let {id,stepId,status} = ctx.request.body;
        let url = `${OA_URL}/bizProp/edit?isProxyeda=1&id=${id}&stepId=${stepId}`;
        let rs = await fetch(url, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = cheerio.load(rs.body,{
            decodeEntities: false
        });
        let json = {
            propName:$("input[id='propName']").val(),
            propDate:$("input[id='propDate']").val(),
            pempMtel:$("input[id='pempMtel']").val(),
            propActu:$("input[id='propActu']").val(),
            propMeas:$("input[id='propMeas']").val(),
            recAempId:$("input[id='recAempId']").val(),
        };
        //合理化分类
        let fenlei_arr =  [];
        $("select[id='ptId'] option").each((i,e)=>{
            fenlei_arr.push({
                text:$(e).text().trim(),
                value:$(e).attr('value')
            });
        })
        json.hlh_fenlei = fenlei_arr;
        //提出部门协调员意见
        json.tcbmxtyyj = $("form table").find("tr").eq(6).find("td").eq(1).html().trim().split("<br>").filter(item=>{
            return item!=''
        }).map(item=>{
            return {
                text:item
            }
        });
        //附件数组
        let file_arr = [];
        $("table[id='attachtdownload'] tr").each((i,e)=>{
            let trId = $(e).attr("id");
            file_arr.push({
                filename:$(e).find('td').eq(0).text().trim(),
                attachSeriNo:trId.substring(7)
            })
        })
        json.fileList = file_arr;
        //隐藏参数
        let hide_arr = [];
        $("input[type='hidden']").each((i,e)=>{
            hide_arr.push({
                name:$(e).attr("name"),
                value:$(e).attr("value"),
            })
        })
        json.hideInfo = hide_arr;
        return json;
    }
    
    
};