const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface');// 代表父目录为/insterface

const interfaceController = require('../controllers/interface');

module.exports = router
    .get('/list', interfaceController.list);// get请求，请求路径即为/interface/list，如果config中配置了projectPath则需要在路径前加上