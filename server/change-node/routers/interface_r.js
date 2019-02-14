const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/interface

const interfaceController = require('../controllers/interface_c');

module.exports = router
    .post('/modelCodeQuery', interfaceController.modelCodeQuery)
    .post('/configQuery', interfaceController.configQuery)
    .post('/insertLog', interfaceController.insertLog)


