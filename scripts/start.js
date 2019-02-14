const path = require('path'), 
    fs = require('fs');
const supervisor = require('supervisor/lib/supervisor.js');


let project = 'demo', projectPath = '';
try{
    project = JSON.parse(process.env.npm_config_argv).original.pop();
    projectPath = path.join(__dirname, '../dist', project);
    if(!fs.existsSync(projectPath)){
        throw new Error('找不到项目：'+project);
    }
    run();
}catch(e){
    console.log(e);
}

function run(){
    console.log('当前运行服务：'+project);
    const appPath = path.join(projectPath, 'app.js');
    supervisor.run([ '-w', projectPath, '--', appPath ]);
}


