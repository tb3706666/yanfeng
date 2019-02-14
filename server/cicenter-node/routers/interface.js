const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const interfaceController = require('../controllers/interface');
const accessController = require('../controllers/access');
module.exports = router
    .get('/getcookie', accessController.getcookie)
    .post('/hlh_list.jsp',interfaceController.hlh_list)
    .post('/hlh_chaoqi_list.jsp',interfaceController.hlh_chaoqi_list)
    .post('/hlh_other_list.jsp',interfaceController.hlh_other_list)
    .post('/hlh_detail.jsp',interfaceController.hlh_detail)
    .post('/hlh_add.jsp',interfaceController.hlh_add)
    .post('/upload',interfaceController.upload)
    .get('/deleteAddt',interfaceController.deleteAddt)
    .post('/createSubmit',interfaceController.createSubmit)
    .post('/search.jsp',interfaceController.search)
    .post('/hlh_query_init.jsp',interfaceController.hlh_query_init)
    .post('/griddatasInProc',interfaceController.griddatasInProc)
    .get('/hlh_query_detail.jsp',interfaceController.hlh_query_detail)
    .get('/download',interfaceController.download)
    .post('/hlh_deal_init.jsp',interfaceController.hlh_deal_init)
    .post('/SelectList',interfaceController.SelectList)
    .post('/hlh_credit_init.jsp',interfaceController.hlh_credit_init)
    .post('/jifenList',interfaceController.jifenList)
    .post('/buildOrgSelectedTree',interfaceController.buildOrgSelectedTree)
    .post('/buildOrgSelectedTree1',interfaceController.buildOrgSelectedTree1)
    .post('/toAssesSubmit',interfaceController.oaSubmit)
    .post('/toAllocateSubmit',interfaceController.oaSubmit)
    .post('/toAllocateASubmit',interfaceController.oaSubmit)
    .post('/toImplementeSubmit',interfaceController.oaSubmit)
    .post('/toVerifySubmit',interfaceController.oaSubmit)
    .post('/hlh_edit.jsp',interfaceController.hlh_edit)
    .post('/hlh_eval_init.jsp',interfaceController.hlh_eval_init)
    .post('/EvalList',interfaceController.EvalList)
    .get('/hlh_eval_detail.jsp',interfaceController.hlh_eval_detail)
    .post('/toGrantSubmit',interfaceController.toGrantSubmit)
    .post('/getSects',interfaceController.getSects)
    .post('/getEmpInfos',interfaceController.getEmpInfos)
    .post('/hlh_other_detail.jsp',interfaceController.hlh_other_detail)
    .post('/hlh_other_edit.jsp',interfaceController.hlh_other_edit)
    
    
    