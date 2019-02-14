const path = require('path');
const app = require('chestnut-app');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
// 初始化日志
require('./utils/logger');

if (process.env.NODE_ENV !== 'production') {
    //require('../.agile/dev')(app);
    app.use(async function (ctx, next) {
        ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin);
        ctx.set("Access-Control-Allow-Credentials", "true");
        ctx.set("Access-Control-Allow-Methods", "*");

        await next();
    });
}

    
const config = require('./configs/config');

const code = require('./configs/code');
 // 初始化错误码
code.init();

const router = require('chestnut-router');
const filters = require('./filters/router.filter');
router.addFilters(filters);


if (process.env.NODE_ENV !== 'production') {
    app.start(config);
} else {
    app.startCluster(config);
}




