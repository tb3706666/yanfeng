/**
 * 常用工具集函数
 * 
 */

var tool = {
    getUrlParam: function(param){//获取url中参数
        var args = new Object();
        var argsStr = location.search;  
        if (argsStr.length > 0) {
            argsStr = argsStr.substring(1);
            var nameValueArr = argsStr.split("&");  //多参数
            for (var i = 0; i < nameValueArr.length; i++) {
                var pos = nameValueArr[i].indexOf('=');
                if (pos == -1) continue; //如果没有找到就跳过
                var argName = nameValueArr[i].substring(0, pos); //提取name
                var argVal = nameValueArr[i].substring(pos + 1); //提取value
                args[argName] = unescape(argVal);
            }
            return args[param];
        }
    },
    //根据文件名获取文件图标
    getAttachIcon:function(attachName){
        try{
            var suffix = attachName.substring(attachName.lastIndexOf(".") + 1, attachName.length).toLowerCase();;
            if(suffix.indexOf("doc") > -1){
                return {class:"icon auicon icon-typeword-fill",color:"#428bca"};
            }else if(suffix.indexOf("pdf") > -1){
                return {class:"icon auicon icon-typepdf-fill",color:"red"};
            }else if(suffix.indexOf("xls") > -1){
                return {class:"icon auicon icon-typeexcel-fill",color:"#27AE60"};
            }else if(suffix.indexOf("ppt") > -1){
                return {class:"icon auicon icon-typeppt-fill",color:"#B7472A"};
            }else if(suffix.indexOf("mp4") > -1 || suffix.indexOf("avi") > -1 || suffix.indexOf("3gp") > -1 || suffix.indexOf("wmv") > -1 || suffix.indexOf("mpeg") > -1 || suffix.indexOf("flv") > -1){
                return {class:"icon auicon icon-typevideo-fill",color:"#2980B9"};
            }else if(suffix.indexOf("txt") > -1){
                return {class:"icon auicon icon-typetext-fill",color:"#2980B9"};
            }else if(suffix.indexOf("mp3") > -1 || suffix.indexOf("wma") > -1){
                return {class:"icon auicon icon-typeaudio-fill",color:"#2980B9"};
            }else if(suffix.indexOf("png") > -1 || suffix.indexOf("jpg") > -1 || suffix.indexOf("jpeg") > -1 || suffix.indexOf("gif") > -1 || suffix.indexOf("tif") > -1 || suffix.indexOf("bmp") > -1 || suffix.indexOf("psd") > -1 || suffix.indexOf("svg") > -1){
                return {class:"icon auicon icon-typepic-fill",color:"#428bca"};
            }else{
                return {class:"icon auicon icon-attach-fill",color:"#428bca"};
            }
        }catch(e){
            return {class:"icon auicon icon-attach-fill",color:"#428bca"};
        }
    },
    mobileNoRegex:function(mobileNo){
        try {
            var phone = Number(mobileNo);
            var patern = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!patern.test(phone)){
                return false;
            }else{
                return true;
            }
        } catch (error) {
            return false;
        }
    },
    closeModal:function(){//监听Android返回键，返回时清除所有模态窗口
        appnest.navigation.setBackListen({
        active: 1 //开发者自定义监听
        });
        document.addEventListener("back", function() {
            $("aui-loading").remove();
            $("aui-actionsheet").remove();
            $("aui-selectsheet").remove();
            $("aui-alert").remove();
            $("aui-confirm").remove();
            appnest.navigation.canBack({
                success: function(res) {
                var result = res.code; //当前浏览器是否支持返回上一页 ,0：不支持；1：支持
                if (result == 1) {
                    appnest.navigation.goBack();
                } else {
                    appnest.navigation.closeWindow();
                }
                },
                fail: function(res) {}
            });
        });
    }
}
module.exports = tool;