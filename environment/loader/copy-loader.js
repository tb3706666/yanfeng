const loaderUtils = require('loader-utils');

module.exports = function (source) {

    const request = loaderUtils.getCurrentRequest(this),
        url = request.split('!').pop();

    const rs = require(url);

    var routerStr = `module.exports = function(){
        return ${rs};
    }`;

    return routerStr;
};