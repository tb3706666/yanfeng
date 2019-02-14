const fs = require('fs');

let config;

if(process.env.NODE_ENV==='production'){
  try{
    const routerPath = require('../../../environment/loader/copy-loader!./router');
    config = require('./config.prod');
    config.middleware.routerPath = routerPath;
  }catch(e){
    console.log('\n', '首次使用请配置config.prod.js文件，可参考config.default.js', '\n');
  }
  
}else{
  config = require('./config.default');
}

module.exports = config;