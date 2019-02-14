const routerUtil = require('chestnut-router');
const router = routerUtil.create('/access');// 代表父目录为/access

const accessController = require('../controllers/access');

module.exports = router
    .post('/ek', accessController.login)