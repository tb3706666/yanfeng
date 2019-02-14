const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const accessController = require('../controllers/access');
const interfaceController = require('../controllers/interface');

module.exports = router
    .get('/getcookie',accessController.getcookie)
    .post('/searchs',interfaceController.searchs)
    .get('/getuserkey',interfaceController.getuserkey)
    .post('/uploaderServlet',interfaceController.uploaderServlet)
    .get('/handleAttUpload',interfaceController.handleAttUpload)
    .post('/save',interfaceController.save)