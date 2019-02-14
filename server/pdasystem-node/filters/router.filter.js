

const code = require('../configs/code');

const projectPath = require('../configs/config').projectPath;


function getFilesObj(files){
    files = files || [];
    const obj = {};
    files.forEach(file => {
        if(file.fieldname){
            if(obj[file.fieldname]){
                if(!(obj[file.fieldname] instanceof Array)){
                    obj[file.fieldname] = [obj[file.fieldname]];
                }
                obj[file.fieldname].push(file);
            }else{
                obj[file.fieldname] = file;
            }
        }
    });
    return obj
}


// 此规则需要自己定义
const rules = {
    default: function (ctx) {
        return true;//无会话信息
    }
};

module.exports = rules;