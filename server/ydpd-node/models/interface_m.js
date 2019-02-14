// 页面抓取相关工具集
const { fetch, jqlite } = require('chestnut-utils');
const { ydpd:ydpd_url } = require('../configs/config').systemPath;
module.exports = {
    async getList(ctx){//请求首页列表数据
        const postData = ctx.request.body; 
        const {username,pageNumbe} = postData;
        let rs = await fetch(`${ydpd_url}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
               <tem:GetTaskListByUser>
                  <tem:userName>${username}</tem:userName>
                  <tem:pageNumber>${pageNumbe}</tem:pageNumber>
               </tem:GetTaskListByUser>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           return JSON.parse($('GetTaskListByUserResult').text());
        }
    },
    async getDetail(ctx){//请求盘点详情数据
        const postData = ctx.request.body; 
        const {taskId,username,pageNumbe} = postData;
        let rs = await fetch(`${ydpd_url}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
               <tem:GetSubTaskList>
                  <tem:taskid>${taskId}</tem:taskid>
                  <tem:username>${username}</tem:username>
                  <tem:page>${pageNumbe}</tem:page>
               </tem:GetSubTaskList>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           return JSON.parse($('GetSubTaskListResult').text());
        }
    },
    async decodeSub(ctx){//扫描提交
        const postData = ctx.request.body; 
        const {taskId,username,assetTag} = postData;
        let rs = await fetch(`${ydpd_url}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
               <tem:SetInventoryCompleted>
                  <tem:taskId>${taskId}</tem:taskId>
                  <tem:assetTag>${assetTag.trim()}</tem:assetTag>
                  <tem:uploader>${username}</tem:uploader>
               </tem:SetInventoryCompleted>
            </soapenv:Body>
         </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           return JSON.parse($('SetInventoryCompletedResult').text());
        }
    },
    async findNew(ctx){//无法扫描上报
        const postData = ctx.request.body; 
        const {taskId,name,location,remark,serialNumber,gid,phone,status,uploader} = postData;
        let rs = await fetch(`${ydpd_url}`, {
            ctx: ctx,
            method: 'post',
            headers: {
                'Content-Type':'text/xml;charset=UTF-8'
            },
            body:`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
                <soapenv:Header/>
                <soapenv:Body>
                <tem:NewInventoryAsset>
                    <tem:taskId>${taskId}</tem:taskId>
                    <tem:name>${name.trim()}</tem:name>
                    <tem:location>${location.trim()}</tem:location>
                    <tem:remark>${remark.trim()}</tem:remark>
                    <tem:serialNumber>${serialNumber.trim()}</tem:serialNumber>
                    <tem:gid>${gid.trim()}</tem:gid>
                    <tem:phone>${phone.trim()}</tem:phone>
                    <tem:status>${status}</tem:status>
                    <tem:uploader>${uploader.trim()}</tem:uploader>
                </tem:NewInventoryAsset>
                </soapenv:Body>
            </soapenv:Envelope>`
        });
        if(rs.error){
            return null;
        }else{
           var $ = jqlite(rs.body);
           return JSON.parse($('NewInventoryAssetResult').text());
        }
    }
}