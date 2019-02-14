const routerUtil = require('chestnut-router');
const router = routerUtil.create('/interface/dianjian');// 代表父目录为/dianjian

const djController = require('../controllers/dianjian_c');

module.exports = router
    .post('/newlist', djController.newslist)
    .post('/getworkorder', djController.getWorkOrder)
    .post('/djsub', djController.djsub)
    .get('/downloadimg', djController.download)