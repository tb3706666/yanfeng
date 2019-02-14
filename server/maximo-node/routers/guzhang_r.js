const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface/guzhang');// 代表父目录为/guzhang

const gzController = require('../controllers/guzhang_c');

module.exports = router
    .post('/list', gzController.getGzList)
    .post('/zichanquery', gzController.zichanQuery)
    .post('/weizhiquery', gzController.weizhiQuery)
    .post('/gzquery', gzController.getGzms)
    .post('/gzsub', gzController.gzSub)
    .post('/gzsubstatus', gzController.gzSubStatus)
    .post('/newgd', gzController.newgd)