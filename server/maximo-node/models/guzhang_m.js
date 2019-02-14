// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { maximo:maximo_url } = require('../configs/config').systemPath;

const moment = require('moment');//时间处理函数
const fixDecemial = require('decimal.js');//小数四舍五入函数

module.exports = {
    async getGzList(ctx){//故障列表数据
        const postData = ctx.request.body; // 获取post提交的数据
        const {badge,maxSITEID} = postData;

        let rs = await fetch(`${maximo_url}/meaweb/services/CURWOEM`, {
            ctx: ctx,
            method: 'post',
            headers: {
                  'SOAPAction':'"urn:processDocument"',
                  'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
            <soapenv:Header/>
            <soapenv:Body>
               <max:QueryCURWOEM creationDateTime="EN" baseLanguage="EN">
                  <max:CURWOEMQuery orderby="wonum" operandMode="AND">
                     <max:WORKORDER>
                        <max:SITEID operator="=" operandModeOR="true">${maxSITEID}</max:SITEID>
                        <max:STATUS  operator="=" operandModeOR="true">APPR</max:STATUS>
                        <max:WORKTYPE >EM,CM</max:WORKTYPE>
                        
                        <max:WPLABOR filter="true">
                           <max:LABORCODE operator="=" operandModeOR="true">${badge}</max:LABORCODE>
                        </max:WPLABOR>
                        
                     </max:WORKORDER>
                  </max:CURWOEMQuery>
               </max:QueryCURWOEM>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
         }else{
            var $ = jqlite(rs.body);
            var resultJson = {list:[]};
            $('WORKORDER').each((i,e)=>{
               let workOrderObj = {};
               workOrderObj.indexs = i;
               workOrderObj.assetnum = $(e).children('assetnum').text();
               workOrderObj.description = $(e).children('description').text();
               workOrderObj.wonum = $(e).children('wonum').text();
               workOrderObj.TARGSTARTDATE = $(e).children('TARGSTARTDATE').text().replace(/T00:00:00\+/g,' ');
               workOrderObj.worktype = $(e).children('WORKTYPE').text();
               workOrderObj.status = $(e).children('STATUS').text();
               workOrderObj.asset_assetnum = $(e).find('ASSET ASSETNUM').text();
               workOrderObj.asset_description = $(e).find('ASSET description').text();
               workOrderObj.locations_location = $(e).find('LOCATIONS LOCATION').text();
               workOrderObj.locations_description = $(e).find('LOCATIONS DESCRIPTION').text();
               
               workOrderObj.tinggongkaishishijian = $(e).find('targstartdate').text().replace(/T00:00:00\+/g,' ');
               workOrderObj.tinggongjieshushijian = $(e).find('targcompdate').text().replace(/T00:00:00\+/g,' ');
               workOrderObj.shijikaishiriqizong = $(e).find('actstart').text().replace(/T.*\+/g,' ');
               workOrderObj.shijikaishishijianzong = $(e).find('actstart').text().replace(/.*?T(.*?)\+.*/g,'$1');
               workOrderObj.shijijieshuriqizong = $(e).find('actfinish').text().replace(/T.*\+/g,' ');
               workOrderObj.shijijieshushijianzong = $(e).find('actfinish').text().replace(/.*?T(.*?)\+.*/g,'$1');
   
               workOrderObj.failurecode = $(e).find('FAILURECODE').text();
               workOrderObj.PROBLEM = $(e).find("FAILUREREPORT TYPE:contains('PROBLEM')").parent().children('FAILURECODE').text();
               workOrderObj.CAUSE = $(e).find("FAILUREREPORT TYPE:contains('CAUSE')").parent().children('FAILURECODE').text();
               workOrderObj.REMEDY = $(e).find("FAILUREREPORT TYPE:contains('REMEDY')").parent().children('FAILURECODE').text();
   
               workOrderObj.labtransid = $(e).find('LABTRANS LABTRANSID').text();
               if($(e).find("LABTRANS STARTDATE:contains('T')").length > 0){
                  workOrderObj.shijikaishiriqi = $(e).find('LABTRANS STARTDATE').text().split('T')[0];
               }else{
                  workOrderObj.shijikaishiriqi = '';
               }
               if($(e).find("LABTRANS STARTTIME:contains('T')").length > 0){
                  workOrderObj.shijikaishishijian = $(e).find('LABTRANS STARTTIME').text().split('T')[1].replace(/\+08:00\+/g,' ');
               }else{
                  workOrderObj.shijikaishishijian = '';
               }
               if($(e).find("LABTRANS FINISHTIME:contains('T')").length > 0){
                  workOrderObj.shijijieshushijian = $(e).find('LABTRANS FINISHTIME').text().split('T')[1].replace(/\+08:00\+/g,' ');
               }else{
                  workOrderObj.shijijieshushijian = '';
               }
               let woactivity = [];
               $(e).find("WOACTIVITY").each((i,wce)=>{
                  let wcObj = {};
                  wcObj.taskid = $(wce).find('TASKID').text();
                  wcObj.description = $(wce).find('DESCRIPTION').text();
                  wcObj.observation = $(wce).find('OBSERVATION').text();
                  wcObj.measurementvalue = $(wce).find('MEASUREMENTVALUE').text();
                  wcObj.wonum = $(wce).find('WONUM').text();
                  woactivity.push(wcObj);
               });
               workOrderObj.woactivity = woactivity;
               resultJson.list.push(workOrderObj);
            });
            return resultJson;
         }
   },
   async zichanQuery(ctx){//资产查询
      const postData = ctx.request.body; // 获取post提交的数据
      const {maxSITEID,bianma,miaoshu} = postData;
      let subparam=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
      <soapenv:Header/>
      <soapenv:Body>
         <max:QueryCURAST creationDateTime="EN" baseLanguage="EN">
            <max:CURASTQuery orderby="ASSETNUM" operandMode="AND">
               <max:ASSET>
                  <max:SITEID operator="=" operandModeOR="true">${maxSITEID}</max:SITEID>
                  <max:STATUS operator="=" operandModeOR="true">OPERATING</max:STATUS>`;
      if(bianma && bianma != ""){
         subparam += `<max:ASSETNUM>${bianma}</max:ASSETNUM>`;
      }
      if(miaoshu && miaoshu != ""){
         subparam += `<max:DESCRIPTION>${miaoshu}</max:DESCRIPTION>`;
      }
      subparam += `</max:ASSET>
            </max:CURASTQuery>
         </max:QueryCURAST>
      </soapenv:Body>
      </soapenv:Envelope>`;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURAST`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:subparam
      });  
      if(rs.error){
         return null;
      }else{
         var $ = jqlite(rs.body);
         var resultJson = {list:[]};
         $('asset').each((i,e)=>{
            let assetObj = {};
            assetObj.indexs = i;
            assetObj.description = $(e).children('description').text();
            assetObj.assetnum = $(e).children('assetnum').text();
            assetObj.location = $(e).children('location').text();
            assetObj.siteid = $(e).children('siteid').text().replace(/T00:00:00\+/g,' ');
            assetObj.status = $(e).children('status').text();
            assetObj.weizhidescription = $(e).find('locations description').text();
            assetObj.weizhilocation = $(e).find('locations location').text();
            assetObj.FAILURECODE = $(e).children('failurecode').text();
            assetObj.FAILURELIST = $(e).find('failurelist failurelist').text();
            resultJson.list.push(assetObj);
         });
         return resultJson;
      }
   },
   async weizhiQuery(ctx){//位置查询
      const postData = ctx.request.body; // 获取post提交的数据
      const {maxSITEID} = postData;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURLOC`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
         <soapenv:Header/>
         <soapenv:Body>
            <max:QueryCURLOC creationDateTime="EN" baseLanguage="EN">
               <max:CURLOCQuery orderby="location" operandMode="AND">
                  <max:LOCATIONS>
                     <max:SITEID operator="=" operandModeOR="true">${maxSITEID}</max:SITEID>
                  </max:LOCATIONS>
               </max:CURLOCQuery>
            </max:QueryCURLOC>
         </soapenv:Body>
      </soapenv:Envelope>`
      });  
      if(rs.error){
         return null;
      }else{
         var $ = jqlite(rs.body);
         var resultJson = {list:[]};
         $('locations').each((i,e)=>{
            let locObj = {};
            locObj.indexs = i;
            locObj.description = $(e).children('description').text();
            locObj.location = $(e).children('location').text();
            locObj.siteid = $(e).children('siteid').text().replace(/T00:00:00\+/g,' ');
            locObj.status = $(e).children('status').text();
            resultJson.list.push(locObj);
         })
         return resultJson;
      }
   },
   async getGzms(ctx){//故障查询
      const postData = ctx.request.body; // 获取post提交的数据
      const {maxORGID,caozuo,bm,DESCRIPTION,PARENT} = postData;
      let subparam = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
      <soapenv:Header/>
      <soapenv:Body>
         <max:QueryCURFCODE creationDateTime="EN" baseLanguage="EN">
            <max:CURFCODEQuery orderby="FAILURECODE" operandMode="AND">
               <max:FAILURECODE>
                       <max:ORGID operator="=" operandModeOR="true">${maxORGID}</max:ORGID>`;
      if(bm && bm != ''){
         subparam += `<max:FAILURECODE>${bm}</max:FAILURECODE>`;
      }
      if(DESCRIPTION && DESCRIPTION != ''){
         subparam += `<max:DESCRIPTION>${DESCRIPTION}</max:DESCRIPTION>`;
      }
      if(caozuo == 'gz'){
         subparam += `<max:FAILURELIST><max:TYPE/></max:FAILURELIST>`;
      }else if(caozuo == 'PROBLEM'){
         subparam += `<max:FAILURELIST>
            <max:TYPE operator="=" operandModeOR="true">PROBLEM</max:TYPE>  
            <max:PARENT operator="=" operandModeOR="true">${PARENT}</max:PARENT>     
         </max:FAILURELIST>`;
      }else if(caozuo == 'CAUSE'){
         subparam += `<max:FAILURELIST>
            <max:TYPE operator="=" operandModeOR="true">CAUSE</max:TYPE>  
            <max:PARENT operator="=" operandModeOR="true">${PARENT}</max:PARENT>     
         </max:FAILURELIST>`;
      }else if(caozuo == 'REMEDY'){
         subparam += `<max:FAILURELIST>
            <max:TYPE operator="=" operandModeOR="true">REMEDY</max:TYPE>  
            <max:PARENT operator="=" operandModeOR="true">${PARENT}</max:PARENT>     
         </max:FAILURELIST>`;
      }
      subparam += `</max:FAILURECODE> 
            </max:CURFCODEQuery>
         </max:QueryCURFCODE>
      </soapenv:Body>
      </soapenv:Envelope>`;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURFCODE`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:subparam
      });  
      if(rs.error){
         return null;
      }else{
         var $ = jqlite(rs.body);
         var resultJson = {list:[]};
         $('curfcodeset').children('failurecode').each((i,e)=>{
            let failureObj = {};
            failureObj.failurecode = $(e).children('failurecode').text();
            failureObj.description = $(e).children('description').text();
            failureObj.type = $(e).children('type').text();
            failureObj.FAILURELIST = $(e).children('failurelist').eq(0).children('failurelist').text();
            resultJson.list.push(failureObj);
         });
         return resultJson;
      }
   },
   async gzSub(ctx){//故障表单数据提交
      const postData = ctx.request.body; // 获取post提交的数据
      const {gongdan,gongdanleixing,miaoshu,zichan1,weizhi1,maxSITEID,renyuanRE,rshijikaishiriqiaddRE,
         shijikaishishijianaddRE,shijijieshushijianaddRE,xiangidRE,xiangmiaoshuRE,ops,gzhb_gz,gzhb_wt,gzhb_yy,gzhb_cs} = postData;
      let subparam = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
      <soapenv:Header/>
      <soapenv:Body>
         <max:UpdateCURWOEM creationDateTime="EN" transLanguage="EN">
            <max:CURWOEMSet>
               <max:WORKORDER action="Change">
                  <max:MAXINTERRORMSG>?</max:MAXINTERRORMSG>
                  <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                  <max:ACTFINISH changed="?">${rshijikaishiriqiaddRE.split('vv')[0]+'T'+shijijieshushijianaddRE.split("vv")[0]}</max:ACTFINISH> 
                  <max:ACTSTART changed="?">${rshijikaishiriqiaddRE.split('vv')[0]+'T'+shijikaishishijianaddRE.split("vv")[0]}</max:ACTSTART>
                  <max:STATUS changed="?">${ops}</max:STATUS>
                  <max:WORKTYPE changed="?">${gongdanleixing}</max:WORKTYPE>
                  <max:WONUM changed="?">${gongdan}</max:WONUM>
                  <max:DESCRIPTION changed="?">${miaoshu}</max:DESCRIPTION>
                  <max:ASSETNUM changed="?">${zichan1}</max:ASSETNUM>
                  <max:LOCATION changed="?">${weizhi1}</max:LOCATION>
                  <max:FAILURECODE changed="?">${gzhb_gz}</max:FAILURECODE>`;
      if(gzhb_wt && gzhb_wt != ''){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_wt}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">PROBLEM</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      if(gzhb_yy && gzhb_yy != ''){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_yy}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">CAUSE</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      if(gzhb_cs && gzhb_cs != ''){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_cs}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">REMEDY</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      if(xiangidRE && xiangidRE != ''){
         let xiangidArr = xiangidRE.split('vv');
         xiangidArr.forEach((e,i)=>{
            let WONUM = 'T'+gongdan+e;
            subparam += `<max:WOACTIVITY action="Add" >
               <max:TASKID changed="?">${e}</max:TASKID>
               <max:DESCRIPTION changed="?">${xiangmiaoshuRE.split("vv")[i]}</max:DESCRIPTION>
               <max:WONUM changed="?">${WONUM}</max:WONUM>
               <max:STATUS maxvalue="?" changed="?">${ops}</max:STATUS>
            </max:WOACTIVITY>`;
         });
      }

      if(renyuanRE && renyuanRE != ''){
         let renyuanArr = renyuanRE.split('vv');
         renyuanArr.forEach((e,i)=>{
            subparam += `<max:LABTRANS action="Add">             
               <max:LABORCODE changed="?">${e}</max:LABORCODE>       
               <max:STARTDATE changed="?">${rshijikaishiriqiaddRE.split("vv")[i]}</max:STARTDATE >  
               <max:STARTTIME changed="?">${shijikaishishijianaddRE.split("vv")[i]}</max:STARTTIME >    
               <max:FINISHTIME changed="?">${shijijieshushijianaddRE.split("vv")[i]}</max:FINISHTIME >
            </max:LABTRANS>`;
         });
      }
      subparam += `</max:WORKORDER>
            </max:CURWOEMSet>
         </max:UpdateCURWOEM>
      </soapenv:Body>
      </soapenv:Envelope>`;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURWOEM`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:subparam
      });  
      if(rs.error){
         return null;
      }else{
         if(rs.body.indexOf('<faultcode>') > -1){
            return {result:'fail'};
         }else{
            return {result:'success'};
         }
      }
   },
   async gzSubStatus(ctx){//故障表单提交后续操作
      const postData = ctx.request.body; // 获取post提交的数据
      const {gongdan,zichan1,weizhi1,maxSITEID,tgkaishishijian,tgjieshushijian,maxORGID} = postData;
      let diffH = moment(tgkaishishijian).diff(moment(tgjieshushijian),"hours",true);
      let DOWNTIME12 = new fixDecemial(diffH).toFixed(2);
      let rs = await fetch(`${maximo_url}/meaweb/services/CURASTSTATUS`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
         <soapenv:Header/>
         <soapenv:Body>
            <max:CreateCURASTSTATUS creationDateTime="EN" transLanguage="EN">
               <max:CURASTSTATUSSet>
                  <max:CURASSETSTATUS action="Add" >            
                     <max:WONUM changed="?">${gongdan}</max:WONUM>
                     <max:ASSETNUM changed="?">${zichan1}</max:ASSETNUM>
                     <max:LOCATION changed="?">${weizhi1}</max:LOCATION>
                     <max:CHANGEDATE changed="?">${tgkaishishijian.replace(/\s/g,'T')}</max:CHANGEDATE>
                     <max:DOWNTIME changed="?">0</max:DOWNTIME>
                     <max:ISRUNNING changed="?">0</max:ISRUNNING>
                     <max:OPERATIONAL changed="?">1</max:OPERATIONAL>
                     <max:ORGID changed="?">${maxORGID}</max:ORGID>
                     <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                     <max:CHANGEBY changed="?">MXINTADM</max:CHANGEBY>             
                  </max:CURASSETSTATUS>
                    <max:CURASSETSTATUS action="Add" >
                     <max:WONUM changed="?">${gongdan}</max:WONUM>
                     <max:ASSETNUM changed="?">${zichan1}</max:ASSETNUM>
                     <max:LOCATION changed="?">${weizhi1}</max:LOCATION>
                     <max:CHANGEDATE changed="?">${tgjieshushijian.replace(/\s/g,'T')}</max:CHANGEDATE>           
                     <max:DOWNTIME changed="?">${DOWNTIME12}</max:DOWNTIME>
                     <max:ISRUNNING changed="?">1</max:ISRUNNING>
                     <max:OPERATIONAL changed="?">1</max:OPERATIONAL>
                     <max:ORGID changed="?">${maxORGID}</max:ORGID>
                     <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                     <max:CHANGEBY changed="?">MXINTADM</max:CHANGEBY>             
                  </max:CURASSETSTATUS>
      
               </max:CURASTSTATUSSet>
            </max:CreateCURASTSTATUS>
         </soapenv:Body>
      </soapenv:Envelope>`
      });  
      if(rs.error){
         return null;
      }else{
         if(rs.body.indexOf('<faultcode>') > -1){
            return {result:'fail'};
         }else{
            return {result:'success'};
         }
      }
   },
   async newgd(ctx){//创建工单初始化请求
      const postData = ctx.request.body; // 获取post提交的数据
      const {badge,maxSITEID,maxORGID,hiddenNow,hiddenNow2} = postData;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURWOEM`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
            <soapenv:Header/>
            <soapenv:Body>
               <max:CreateCURWOEM  creationDateTime="EN" transLanguage="EN" >
                  <max:CURWOEMSet>
                     <max:WORKORDER action="Add" >
                           <max:MAXINTERRORMSG>?</max:MAXINTERRORMSG>
                           <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                           <max:STATUS changed="?">APPR</max:STATUS>
         
                           <max:WPLABOR action="Add">
                           <max:LABORCODE changed="?">${badge}</max:LABORCODE>                  
                           <max:WPLABORID changed="?">${(hiddenNow+hiddenNow2).replace(/-/g,'').replace(/:/g,'')}</max:WPLABORID>
                           <max:ORGID changed="?">${maxORGID}</max:ORGID>
                           <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                     </max:WPLABOR>            
                     </max:WORKORDER>
                  </max:CURWOEMSet>
               </max:CreateCURWOEM>
            </soapenv:Body>
         </soapenv:Envelope>`
      });  
      if(rs.error){
         return null;
      }else{
         var $ = jqlite(rs.body);
         return $('wonum').text();
      }
   }
   
}