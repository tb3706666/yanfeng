

const { fetch, jqlite } = require('chestnut-utils');
const { oa: OA_URL } = require('../configs/config').systemPath;
const Base64 = require('js-base64').Base64;

module.exports = {
    async searchs(ctx){
        let rs1 = await fetch(`${OA_URL}/ekp/km/information/information/information.do?method=add&s_css=default`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $1 = jqlite(rs1.body);
        let rs2 = await fetch(`${OA_URL}/ekp/sys/common/dataxml.jsp?s_bean=sqlSelectDataBean&keyword=${ctx.request.body.badge}&column=fd_no&orderby=&dataSource=&sqlValue=SELECT 	a.fd_id, 	b.fd_no, 	a.fd_cnname fd_name, 	a.fd_card_no fd_id_no, 	a.fd_edu_type, 	a.fd_party, 	a.fd_marriage, 	a.fd_mobile, 	a.fd_resident, 	a.fd_address, 	a.fd_urgencyperson_name, 	a.fd_urgencyperson_tel  FROM 	SYS_ORG_PERSON a 	RIGHT JOIN SYS_ORG_ELEMENT b ON a.FD_ID = b.FD_ID  WHERE 	b.FD_IS_AVAILABLE = '1'`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $2 = jqlite(rs2.body);
        let result = {
            fdPersonId:$2("data").attr('fd_id'),
            fdNumber:$2("data").attr('fd_no'),
            fdName:$2("data").attr('fd_name'),
            fdCard:$2("data").attr('fd_id_no'),
            fdPhone:$2("data").attr('fd_mobile'),
            fdEducation:$2("data").attr('fd_edu_type'),
            fdPolitical:$2("data").attr('fd_party'),
            fdMarriage:$2("data").attr('fd_marriage'),
            fdRegister:$2("data").attr('fd_resident'),
            fdAddress:$2("data").attr('fd_address'),
            fdEmergency:$2("data").attr('fd_urgencyperson_name'),
            fdEmergencyphone:$2("data").attr('fd_urgencyperson_tel'),
            fdId:$1("input[name='fdId']").val(),
            method_GET:$1("input[name='method_GET']").val(),

            "attachmentForms.information.fdModelId":$1("input[name='attachmentForms.information.fdModelId']").val(),
            "attachmentForms.information.extParam":$1("input[name='attachmentForms.information.extParam']").val(),
            "attachmentForms.information.fdModelName":$1("input[name='attachmentForms.information.fdModelName']").val(),
            "attachmentForms.information.fdKey":$1("input[name='attachmentForms.information.fdKey']").val(),
            "attachmentForms.information.fdAttType":$1("input[name='attachmentForms.information.fdAttType']").val(),
            "attachmentForms.information.fdMulti":$1("input[name='attachmentForms.information.fdMulti']").val(),
            "attachmentForms.information.deletedAttachmentIds":$1("input[name='attachmentForms.information.deletedAttachmentIds']").val(),
            "attachmentForms.information.attachmentIds":$1("input[name='attachmentForms.information.attachmentIds']").val(),
        }
        return result;
    },
    async getuserkey(ctx){
        let rs1 = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=getuserkey`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs1.body);
        let result = {
            status:$("status").text(),
            userkey:$("userkey").text(),
        };
        return result;
    },
    async uploaderServlet(ctx){
        const formData = {
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
        let result ={
            status:$("status").text(),
            filekey:$("filekey").text(),
        }
        return result;
    },
    async handleAttUpload(ctx){
        let{filekey,filename} = ctx.request.query;
        let rs1 = await fetch(`${OA_URL}/ekp/sys/attachment/sys_att_main/sysAttMain.do?method=handleAttUpload&gettype=submit&filekey=${filekey}&filename=${encodeURI(filename)}&fdKey=information&fdModelName=&fdAttType=byte&width=null&height=null&proportion=true&fdModelId=`, {
            ctx: ctx,
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
        });
        let $ = jqlite(rs1.body);
        let result = {
            status:$("status").text(),
            attname:$("attname").text(),
            attid:$("attid").text(),
            msg:$("msg").text(),
            atttype:$("atttype").text(),
        }
        return result
    },
    async save(ctx){
        let fdNumber = ctx.request.body.fdNumber;
        let rs = await fetch(`${OA_URL}/ekp/km/information/information/information.do?method=validateTime&s_ajax=true`, {
            ctx: ctx,
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
            },
            form: {
                fdNumber:fdNumber
            }
        });
        let result = JSON.parse(rs.body.trim());
        let state = result.state;
        let errormsg = result.errormsg;
        let tjmsg ="";
        if(state=="0"){

        }else{
            let formData = {};
            for(let key in ctx.request.body){
                let temp = key.replace(/#/g,'.')
                formData[temp] = ctx.request.body[key];
            }
            rs = await fetch(`${OA_URL}/ekp/km/information/information/information.do?method=save&s_css=default&s_seq=1`, {
                ctx: ctx,
                method: 'post',
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; InfoPath.2)"
                },
                formData: formData
            });
            let $ = jqlite(rs.body);
            tjmsg = $("div[class='msgtitle']").text().trim();
        }
        result = {
            state,
            errormsg,
            tjmsg
        };
        console.log(result)
        return result
    }
    
};