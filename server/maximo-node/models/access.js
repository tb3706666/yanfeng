

// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { maximo:maximo_url } = require('../configs/config').systemPath;

const xml2js = require('xml2js');

//xml2js默认会把子子节点的值变为一个数组, explicitArray设置为false
const xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});

module.exports = {
    async doLogin(ctx){
        const postData = ctx.request.body; // 获取post提交的数据
        const {badge} = postData;
        let rs = await fetch(`${maximo_url}/meaweb/services/CURLABOR`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'SOAPAction':'"urn:processDocument"',
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:max="http://www.ibm.com/maximo">
            <soapenv:Header/>
            <soapenv:Body>
               <max:QueryCURLABOR creationDateTime="EN" baseLanguage="EN" >
                  <max:CURLABORQuery orderby="LABORCODE" operandMode="AND">
                     <max:LABOR>
                        <max:LABORCODE operator="=" operandModeOR="true">${badge}</max:LABORCODE>
                     </max:LABOR>
                  </max:CURLABORQuery>
               </max:QueryCURLABOR>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           var QueryCURLABORResponseStr = $('QueryCURLABORResponse').html();
           //xml->json
           var resultJson = null;
           xmlParser.parseString(QueryCURLABORResponseStr,function(err,result){
              resultJson = result;
            });
            return resultJson;
        }
    }
};