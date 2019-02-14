// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { maximo:maximo_url } = require('../configs/config').systemPath;
const xml2js = require('xml2js');
//xml2js默认会把子子节点的值变为一个数组, explicitArray设置为false
const xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
const Base64 = require('js-base64').Base64;
module.exports = {

    async getDjList(ctx){
        const postData = ctx.request.body; // 获取post提交的数据
        const {ASSETNUM,JPNUM,REPORTEDBY,maxSITEID,WORKTYPE,STATUS} = postData;
        let rs = await fetch(`${maximo_url}/meaweb/services/CURWORKORDER`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'SOAPAction':'"urn:processDocument"',
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
            <soapenv:Header/>
            <soapenv:Body>
               <max:CreateCURWORKORDER  creationDateTime="EN" transLanguage="EN" >
                  <max:CURWORKORDERSet>
                     <max:WORKORDER action="Add" >
                        <max:MAXINTERRORMSG>?</max:MAXINTERRORMSG>
                         <max:ASSETNUM changed="?">${ASSETNUM}</max:ASSETNUM>
                         <max:DESCRIPTION changed="?">点检工单</max:DESCRIPTION>
                        <max:JPNUM changed="?">${JPNUM}</max:JPNUM>
                        <max:REPORTEDBY changed="?">${REPORTEDBY}</max:REPORTEDBY>
                        <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                        <max:WORKTYPE changed="?">${WORKTYPE}</max:WORKTYPE>
                        <max:STATUS changed="?">${STATUS}</max:STATUS>
                     </max:WORKORDER>
                  </max:CURWORKORDERSet>
               </max:CreateCURWORKORDER>
            </soapenv:Body>
         </soapenv:Envelope>`
        });

        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           return {siteid:$('SITEID').text(),wonum:$('WONUM').text()};
        }
    },
    async getWorkOrder(ctx){
        const postData = ctx.request.body; // 获取post提交的数据
        const {siteid,wonum} = postData;
        let rs = await fetch(`${maximo_url}/meaweb/services/CURWORKORDER`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'SOAPAction':'"urn:processDocument"',
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
            <soapenv:Header/>
            <soapenv:Body>
               <max:QueryCURWORKORDER creationDateTime="EN" baseLanguage="EN">
                  <max:CURWORKORDERQuery orderby="wonum" operandMode="AND">
                     <max:WORKORDER>
                        <max:SITEID operator="=" operandModeOR="true">${siteid}</max:SITEID>
                        <max:WONUM operator="=" operandModeOR="true">${wonum}</max:WONUM>
                     </max:WORKORDER>
                  </max:CURWORKORDERQuery>
               </max:QueryCURWORKORDER>
            </soapenv:Body>
         </soapenv:Envelope>`
        });

        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           var CURWORKORDERSetStr = $('CURWORKORDERSet').html();
           //xml->json
           var resultJson = null;
           xmlParser.parseString(CURWORKORDERSetStr,function(err,result){
              resultJson = result;
           });
           return resultJson;
        }
    },
    async djsub(ctx){//点检表单数据提交
        const postData = ctx.request.body; // 获取post提交的数据
        const {wonum,celiangvaluesarray,radiosarray,xianglength,TASKIDarray,WONUMarray,maxSITEID} = postData;
        let subparam=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
        <soapenv:Header/>
        <soapenv:Body>
           <max:UpdateCURWORKORDER  creationDateTime="EN" transLanguage="EN" >
              <max:CURWORKORDERSet>
                 <max:WORKORDER action="Change">
                    <max:MAXINTERRORMSG>?</max:MAXINTERRORMSG>
                    <max:SITEID changed="?">${maxSITEID}</max:SITEID>
                    <max:WONUM changed="?">${wonum}</max:WONUM>`;
        for(var i=0;i<Number(xianglength);i++){
            let CURSPOTERRFLAG = '0',//error
            CURSPOTFLAG="0",//ok
            CURACTIONFLAG="0",//ACTION
            CURSTOPFLAG="0";//Stop Machine
            if(radiosarray.split('vv')[i] == 'OK'){
                CURSPOTFLAG = '1';
            }else if(radiosarray.split('vv')[i] == 'Error'){
                CURSPOTERRFLAG = '1';
            }else if(radiosarray.split('vv')[i] == 'Action'){
                CURACTIONFLAG = '1';
            }else if(radiosarray.split('vv')[i] == 'Stop Machine'){
                CURSTOPFLAG = '1';
            }
            subparam +=`<max:WOACTIVITY action="Change" >
            <max:CURDOCURL changed="?"></max:CURDOCURL>
            <max:CURSPOTERRFLAG changed="?">${CURSPOTERRFLAG}</max:CURSPOTERRFLAG>
            <max:CURSPOTFLAG changed="?">${CURSPOTFLAG}</max:CURSPOTFLAG>
            <max:CURACTIONFLAG changed="?">${CURACTIONFLAG}</max:CURACTIONFLAG>
            <max:CURSTOPFLAG changed="?">${CURSTOPFLAG}</max:CURSTOPFLAG>
            <max:MEASUREMENTVALUE changed="?">${celiangvaluesarray.split("vv")[i].replace(/9090-/g,'')}</max:MEASUREMENTVALUE>
            <max:TASKID changed="?">${TASKIDarray.split("vv")[i]}</max:TASKID>
            <max:WONUM changed="?">${WONUMarray.split("vv")[i]}</max:WONUM>
         </max:WOACTIVITY>`;
        }
                subparam += `</max:WORKORDER>
                </max:CURWORKORDERSet>
            </max:UpdateCURWORKORDER>
        </soapenv:Body>
        </soapenv:Envelope>`;
        let rs = await fetch(`${maximo_url}/meaweb/services/CURWORKORDER`, {
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
    async download(ctx){//图片下载函数，前端提交图片链接base64编码
        let imgurl = Base64.decode(ctx.request.query.imgsrc);

        let rs = await fetch(imgurl, {
            ctx: ctx,
            method: 'get',
            headers: {
              "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            }
        },true);
        return rs;
  
    }
}