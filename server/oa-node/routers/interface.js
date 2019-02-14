const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/access

const accessController = require('../controllers/access');
const qingjiaController = require('../controllers/qingjia');
const jiabanController = require('../controllers/jiaban');
const hrqueryController = require('../controllers/hrquery');
const lizhiController = require('../controllers/lizhi');
const pljbController = require('../controllers/pljb');
const chuchaiController = require('../controllers/chuchai');
const tongyongController = require('../controllers/tongyong');
const shouhuoController = require('../controllers/shouhuo');
const ewyfController = require('../controllers/ewyf');

module.exports = router
    .get('/getcookie',accessController.getcookie)
    //请假申请开始
    .get('/qingjiaList',qingjiaController.getDbList)
    .post('/qingjiasearch',qingjiaController.qingjiasearch)
    .post('/faqi_qingjiasearch',qingjiaController.faqi_qingjiasearch)
    .post('/qingjiadetail',qingjiaController.qingjiadetail)
    .post('/qingjiayiban',qingjiaController.qingjiayiban)
    .post('/qingjiasubmit',qingjiaController.qingjiasubmit)
    .post('/qingjiachoose',qingjiaController.qingjiachoose)
    .post('/qingjiahistory',qingjiaController.qingjiahistory)
    .post('/getQingjianew',qingjiaController.getQingjianew)
    .post('/newqingjia',qingjiaController.newqingjia)
    .post('/file/addfile',qingjiaController.addfile)
    .get('/AttachDownload.aspx',qingjiaController.AttachDownload)//hr附件下载
    //加班申请开始
    .get('/jiabanList',jiabanController.getDbList)
    .post('/jiabansearch',jiabanController.jiabansearch)
    .post('/faqi_jiabansearch',jiabanController.faqi_jiabansearch)
    .post('/jiabandetail',jiabanController.jiabandetail)
    .post('/jiabanyiban',jiabanController.jiabanyiban)
    .post('/jiabansubmit',jiabanController.jiabansubmit)
    .post('/newjiaban',jiabanController.newjiaban)
    //个人信息查询开始
    .get('/personnel.jsp',hrqueryController.personnel)
    .post('/recordQuery.jsp',hrqueryController.recordQuery)
    //离职审批开始
    .get('/lizhiList',lizhiController.getDbList)
    .post('/lizhisearch.jsp',lizhiController.lizhisearch)
    .post('/lizhidetail.jsp',lizhiController.lizhidetail)
    .post('/lizhiyiban.jsp',lizhiController.lizhiyiban)
    //批量加班开始
    .get('/pljbList',pljbController.getDbList)
    .post('/jiaqiansearch.jsp',pljbController.jiaqiansearch)
    .post('/jiaqiandetail.jsp',pljbController.jiaqiandetail)
    .post('/jiaqianyiban.jsp',pljbController.jiaqianyiban)
    .post('/jiaqian/listDeal.jsp',pljbController.listDeal)
    //出差申请开始
    .post('/chuchailist.jsp',chuchaiController.chuchailist)
    .post('/chuchaiquery.jsp',chuchaiController.chuchaiquery)
    .post('/chuchaidetail.jsp',chuchaiController.chuchaidetail)
    .get('/OaAttachDownload',chuchaiController.AttachDownload)//oa附件下载
    .post('/uploaderFile',chuchaiController.addfile)//oa详情附件上传
    .post('/oaSubmit',chuchaiController.oaSubmit)//oa流程提交
    .post('/getpeople.jsp',chuchaiController.getpeople)
    .post('/set_recent_people.jsp',chuchaiController.set_recent_people)
    .post('/chuchaiAddInfo.jsp',chuchaiController.chuchaiAddInfo)
    .post('/sfjpcheckshow.jsp',chuchaiController.sfjpcheckshow)
    .post('/xingchengFile.jsp',chuchaiController.xingchengFile) //行程附件上传
    .post('/jiaotongFile.jsp',chuchaiController.jiaotongFile) //交通附件上传
    .post('/yijianFile.jsp',chuchaiController.yijianFile) //交通附件上传
    .post('/selpeople.jsp',chuchaiController.selpeople) //出差新建之出差人员选人
    .post('/selpeople1.jsp',chuchaiController.selpeople1) //出差新建之出差人选人
    .post('/selpeoplejipiao.jsp',chuchaiController.selpeoplejipiao) 
    .post('/chufajipiao.jsp',chuchaiController.chufajipiao) 
    .post('/chengbenzhongxin.jsp',chuchaiController.chengbenzhongxin) 
    .post('/chuchaiSubmit.jsp',chuchaiController.chuchaiSubmit) 
    //通用审批开始
    .post('/tongyonglist.jsp',tongyongController.tongyonglist)
    .post('/tongyongquery.jsp',tongyongController.tongyongquery)
    .post('/tongyongdetail.jsp',tongyongController.tongyongdetail)
    //收货流程开始
    .post('/cgshdlist.jsp',shouhuoController.cgshdlist)
    .post('/cgshddetail.jsp',shouhuoController.cgshddetail)
    //额外运费开始
    .post('/ewyflist.jsp',ewyfController.ewyflist)
    .post('/ewyfquery.jsp',ewyfController.ewyfquery)
    .post('/ewyfdetail.jsp',ewyfController.ewyfdetail)
    
    
    
    