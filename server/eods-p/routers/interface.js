const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/access

const accessController = require('../controllers/access');

module.exports = router
    .post('/list', accessController.getList)
    .get('/download', accessController.download)
    .get('/getcookie',accessController.getcookie)