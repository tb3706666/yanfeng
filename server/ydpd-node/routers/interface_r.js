const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/yufang

const interfaceController = require('../controllers/interface_c');

module.exports = router
    .post('/list', interfaceController.getList)
    .post('/detail', interfaceController.getDetail)
    .post('/decode', interfaceController.decodeSub)
    .post('/new', interfaceController.findNew)

