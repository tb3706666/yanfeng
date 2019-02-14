// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { maximo:maximo_url } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;
module.exports = {
   async getYfList(ctx){//预防性维护列表数据
      const postData = ctx.request.body; // 获取post提交的数据
      const {badge,maxSITEID,WORKTYPE,STATUS} = postData;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURWOPM`, {
         ctx: ctx,
         method: 'post',
         headers: {
               'SOAPAction':'"urn:processDocument"',
               'Content-Type':'text/xml;charset=UTF-8'
         },
         body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
         <soapenv:Header/>
         <soapenv:Body>
            <max:QueryCURWOPM creationDateTime="EN" baseLanguage="EN">
               <max:CURWOPMQuery orderby="wonum" operandMode="AND">
                  <max:WORKORDER>
                     <max:SITEID operator="=" operandModeOR="true">${maxSITEID}</max:SITEID>
                     <max:STATUS  operator="=" operandModeOR="true">${STATUS}</max:STATUS>
                     <max:WORKTYPE operator="=" operandModeOR="true">${WORKTYPE}</max:WORKTYPE>
                     <max:WPLABOR filter="true">
                        <max:LABORCODE operator="=" operandModeOR="true">${badge}</max:LABORCODE>
                     </max:WPLABOR>
                  </max:WORKORDER>
               </max:CURWOPMQuery>
            </max:QueryCURWOPM>
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
            workOrderObj.assetnum = $(e).children('ASSETNUM').text();
            workOrderObj.description = $(e).children('DESCRIPTION').text();
            workOrderObj.wonum = $(e).children('WONUM').text();
            workOrderObj.TARGSTARTDATE = $(e).children('TARGSTARTDATE').text().replace(/T00:00:00\+/g,' ');
            workOrderObj.worktype = $(e).children('WORKTYPE').text();
            workOrderObj.status = $(e).children('STATUS').text();
            workOrderObj.asset_assetnum = $(e).find('ASSET ASSETNUM').text();
            workOrderObj.asset_description = $(e).find('ASSET description').text();
            workOrderObj.locations_location = $(e).find('LOCATIONS LOCATION').text();
            workOrderObj.locations_description = $(e).find('LOCATIONS DESCRIPTION').text();
            workOrderObj.pm_pmnum = $(e).find('PM PMNUM').text();
            workOrderObj.pm_description = $(e).find('PM DESCRIPTION').text();
            workOrderObj.jpnum_jpnumnum = $(e).find('JOBPLAN JPNUM').text();
            workOrderObj.jpnum_description = $(e).find('JOBPLAN DESCRIPTION').text();

            workOrderObj.targstartdate = $(e).find('TARGSTARTDATE').text().replace(/T00:00:00\+/g,' ');
            workOrderObj.targcompdate = $(e).find('TARGCOMPDATE').text().replace(/T00:00:00\+/g,' ');
            workOrderObj.ACTFINISHshijian = $(e).find('ACTFINISH').text().replace(/T00:00:00\+/g,' ');
            workOrderObj.ACTSTARTshijian = $(e).find('ACTSTART').text().replace(/T00:00:00\+/g,' ');
            workOrderObj.laborcode = $(e).find('WPLABOR LABORCODE').text();

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
               let imtstr = jqlite($(wce).find('DESCRIPTION_LONGDESCRIPTION').text());
               // wcObj.description_longdescription = imtstr('img').attr('src');
               let srcBase64 = Base64.encode(imtstr('img').attr('src'));
               wcObj.description_longdescription = '/dianjian/downloadimg?imgsrc='+srcBase64;
               woactivity.push(wcObj);
            });
            workOrderObj.woactivity = woactivity;
            resultJson.list.push(workOrderObj);
         });
         return resultJson;
      }
   },
   async yfsub(ctx){//预防性维护表单提交
      const postData = ctx.request.body; // 获取post提交的数据
      const {shijikaishiriqi,shijikaishishijian,shijijieshushijian,REceliang,REguance,xianglength,ops,maxSITEID,wonum,
         badge,labtransid,gzhb_gz,gzhb_wt,gzhb_yy,gzhb_cs} = postData;
      let subparam=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
      <soapenv:Header/>
      <soapenv:Body>
         <max:UpdateCURWOPM creationDateTime="EN" transLanguage="EN">
            <max:CURWOPMSet>
               <max:WORKORDER action="Change">
                  <max:MAXINTERRORMSG>?</max:MAXINTERRORMSG>
                  <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                  <max:STATUS maxvalue="?" changed="?">${ops}</max:STATUS>
                  <max:WONUM changed="?">${wonum}</max:WONUM>
                  
                  <max:ACTFINISH changed="?">${shijikaishiriqi}T${shijijieshushijian}</max:ACTFINISH> 
                  <max:ACTSTART changed="?">${shijikaishiriqi}T${shijikaishishijian}</max:ACTSTART>`;
      for(let i=0;i<Number(xianglength);i++){
         subparam += `<max:WOACTIVITY action="Change" >
         <max:MEASUREMENTVALUE changed="?">${REceliang.split('vv')[i].split('--')[1].replace(/9090-/g,'')}</max:MEASUREMENTVALUE>
         <max:OBSERVATION changed="?">${REguance.split('vv')[i].split('--')[1].replace(/9090-/g,'')}</max:OBSERVATION>
          <max:WONUM changed="?">${REceliang.split('vv')[i].split('--')[0]}</max:WONUM>
         </max:WOACTIVITY>`;
      }
      if(undefined == labtransid  || labtransid == ""){
         subparam += `<max:LABTRANS action="Add">
         <max:LABORCODE changed="?">${badge}</max:LABORCODE>
         <max:STARTDATE changed="?">${shijikaishiriqi}</max:STARTDATE >
         <max:STARTTIME changed="?">${shijikaishishijian}</max:STARTTIME >
         <max:FINISHTIME changed="?">${shijijieshushijian}</max:FINISHTIME >
      </max:LABTRANS>`;
      }
      subparam += `<max:FAILURECODE changed="?">${gzhb_gz}</max:FAILURECODE>`;
      if(gzhb_wt && gzhb_wt != ""){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_wt}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">PROBLEM</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      if(gzhb_yy && gzhb_yy != ""){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_yy}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">CAUSE</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      if(gzhb_cs && gzhb_cs != ""){
         subparam += `<max:FAILUREREPORT action="Add">
            <max:FAILURECODE changed="?">${gzhb_cs}</max:FAILURECODE>
            <max:TYPE maxvalue="?" changed="?">REMEDY</max:TYPE>
         </max:FAILUREREPORT>`;
      }
      subparam += `</max:WORKORDER>
            </max:CURWOPMSet>
         </max:UpdateCURWOPM>
      </soapenv:Body>
      </soapenv:Envelope>`;
      let rs = await fetch(`${maximo_url}/meaweb/services/CURWOPM`, {
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
   }
}