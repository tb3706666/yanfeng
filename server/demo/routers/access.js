const routerUtil = require('chestnut-router');
const router = routerUtil.create('/access');// 代表父目录为/access

const accessController = require('../controllers/access');

module.exports = router
    .post('/login', accessController.login);// post请求，请求路径即为/access/login，如果config中配置了projectPath则需要在路径前加上