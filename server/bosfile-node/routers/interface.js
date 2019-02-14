const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const accessController = require('../controllers/access');
const interfaceController = require('../controllers/interface');

module.exports = router
.get('/getcookie',accessController.getcookie)
.post('/list.jsp',interfaceController.list)
.post('/queryList.jsp',interfaceController.queryList)
.post('/detail.jsp',interfaceController.detail)
.get('/OaAttachDownload',interfaceController.AttachDownload)//oa附件下载
.post('/getpeople.jsp',interfaceController.getpeople)
.post('/set_recent_people.jsp',interfaceController.set_recent_people)
.post('/oaSubmit',interfaceController.oaSubmit)//oa流程提交