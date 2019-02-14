const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const accessController = require('../controllers/access');
const interfaceController = require('../controllers/interface');

module.exports = router
.get('/getcookie',accessController.getcookie)
.post('/list',interfaceController.list)
.post('/list_nextpage',interfaceController.list_nextpage)
.post('/detail',interfaceController.detail)
.post('/event',interfaceController.event)
.post('/event2',interfaceController.event2)
.get('/GetAttachment',interfaceController.AttachDownload)
.post('/addevent2',interfaceController.addevent2)
.post('/tree1',interfaceController.tree1)
