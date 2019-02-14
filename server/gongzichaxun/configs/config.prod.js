const path = require('path');
const database = {
    mssql: {
        type: 'mssql',
        user: 'APPadmin',
        password: 'APP@12345',
        server: '10.178.185.64',
        port:1433,
        database: 'YFJC_HRIS',
        options: {
            encrypt: false
        }
    },
};

module.exports = {
    projectPath: '/gongzichaxun', // 项目访问路径，一旦配置，所有的路由访问前必须加上此项目路径
    port: 7007,                                      //启动端口
    rootPath: path.join(__dirname, '../'), // 项目根目录
    database: database, // 配合utils/db.js使用
    dbType: 'mssql',// 配合utils/db.js使用
    middleware: { // 中间件配置
        staticPath: path.join(__dirname, '../static'), // 配置静态目录
        sessionConfig: {
            key: 'SESSIONID', 
            storeConfig: database.redis, // session存储配置;不配置则回话不能持久化
            cookie: {
                maxAge: 30 * 60 * 1000 //24 * 60 * 60 * 1000
            }
        },
        multiParser: { dest: path.join(__dirname, '../../../uploads/') }     //文件上传临时目录
    },
    log: {
        path: path.join(__dirname, '../../../logs'),   //日志目录
        level: 'warn'                               //日志级别
    },
    errorcode: path.join(__dirname, 'codes'),   // 错误码目录
    systemPath: { // 第三方接口地址配置
        
    }
};