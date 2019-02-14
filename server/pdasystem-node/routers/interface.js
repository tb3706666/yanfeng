const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const interfaceController = require('../controllers/interface');

module.exports = router
    .post('/isLists.jsp', interfaceController.isLists)
    .post('/detail.jsp', interfaceController.detail)
    .post('/templates.jsp', interfaceController.templates)
    .post('/inserts.jsp', interfaceController.inserts)
    