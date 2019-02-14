const path = require('path'), 
    fs = require('fs');
const nodemon = require('nodemon');


let project = 'demo';
try{
    project = JSON.parse(process.env.npm_config_argv).original.pop();
    if(!fs.existsSync(path.join(__dirname, '../server', project))){
        throw new Error('找不到项目：'+project);
    }
    run();
}catch(e){
    console.log(e);
}

function run(){
    console.log('当前运行服务：'+project);
    nodemon({
        exec: `node --inspect=0.0.0.0:5858 ./server/${project}/app.js`,
        // script: './server/'+project+'/app.js',
        // args: ['--inspect=0.0.0.0:5858'],
        watch: './server/'+project,
        stdout: true
    });
}


