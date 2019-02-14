const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/access

const interfaceController = require('../controllers/interface_c');

module.exports = router
    .post('/record', interfaceController.recordQuery)
    .post('/person', interfaceController.personQuery)