var glob = require('glob'),
    path = require('path')
    fs = require('fs');

var config = require('./config');

module.exports = {
    codes: {
        success: {
            errcode: 0,
            errmsg: {
                cn: '请求成功'
            },
        },
        common: {
            errorcode: 10000,
            errmsg: {
                cn: '发生未知事件'
            }
        }
    },
    init(){
        var codePath = config.errorcode;
        var files = glob.sync('**/*.json', {cwd: codePath});
        files.forEach((name) => {
            var codes = JSON.parse(fs.readFileSync(path.join(codePath, name), 'utf8')) || [];
            codes.forEach((code) => {
                this.create(code);
            });
        });
    },
    get(errcode, lang){
        var info = {};
        if(typeof errcode === 'object'){
            info = errcode;
            errcode = 'success';
        }
        var code = Object.assign({}, this.codes[errcode] || this.codes['common'], info);
        if(typeof code.errmsg === 'object'){
            code.errmsg = code.errmsg[lang||'cn'] || '';
        }
        return code;
    },
    create(code){
        var codeInfo = {};
        codeInfo[code.errcode] = code;
        Object.assign(this.codes, codeInfo);
    }
}