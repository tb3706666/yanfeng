const log4js = require('log4js');

const path = require('path');

const config = require('../configs/config');

const logConfig = {

    appenders: {

        ruleConsole: {type: 'console'},

        ruleFile: {

            type: 'dateFile',

            filename: path.join(config.log.path, config.projectPath+'-'),

            pattern: 'yyyy-MM-dd.log',

            maxLogSize: 10 * 1000 * 1000,

            numBackups: 3,

            alwaysIncludePattern: true

        }

    },

    categories: {
        //ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF
        default: {appenders: ['ruleConsole', 'ruleFile'], level: 'all'},
        production: {appenders: ['ruleFile'], level: config.log.level || 'warn'}
    },

    replaceConsole: true

};

log4js.configure(logConfig);

let logger;

if(process.env.NODE_ENV==='production'){
    logger = log4js.getLogger('production');
}else{
    logger = log4js.getLogger();
}

const equivalent = {
    log: 'debug',
    debug: '',
    info: '',
    warn: '',
    error: ''
};

for(let k in equivalent){
    console[k] = logger[equivalent[k]||k].bind(logger);
}

module.exports = logger;

