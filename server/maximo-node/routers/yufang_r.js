const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface/yufang');// 代表父目录为/yufang

const yfController = require('../controllers/yufang_c');

module.exports = router
    .post('/list', yfController.getYfList)
    .post('/yfsub', yfController.yfsub)

