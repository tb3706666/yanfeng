import Alert from "@auicomp/alert/Alert.aui";

import { router } from "@auicomp/action/Action.aui";

import commLang from "@lang/comm";
import Loading from "@auicomp/loading/Loading.aui";
import common from "@libs/common";
var config;

var baseUrl = location.host;
var fetch = function(options) {
  var _successFuncCache = options.success,
    _errorFuncCache = options.error;

  // 自动补全url
  if (!/^https?\:\/\//.test(options.url)) {
    options.url = config.serverBaseUrl + options.url;
  }
  //获取真正的url
  options.url = util.getRealUrl(options.url);
  //添加超时时间
  options.timeout = 45000;
  if (!options.type) options.type = "post";

  if (!options.dataType) options.dataType = "json";

  if (options.url.indexOf(baseUrl) < 0) {
    options.xhrFields = {
      withCredentials: true
    };
    options.crossDomain = true;
  }

  options.success = function(data, textStatus, request) {
    Loading.hide();
    if (options.dataType === "json") {
      if (options.data instanceof Array) {
        data = JSON.parse(data.data);
      }
    }
    if (options.dataType === "text") {
      if (options.data instanceof Array) {
        data = data.data;
      }
    }
    //处理错误情况
    if(data.errcode=='10001'){
      Alert.show({
          content:'会话超时，重新进入应用',
          doOk: function(){
              appnest.worktable.reloadApp();
          }
      });
      return;
    }
    if(data.errcode=='10000'){
      Alert.show({
          content: data.errmsg,
          showType: "error",
      });
      return;
    }
    var args = arguments;
    if (options.dsuccess) {
      options.dsuccess.apply(this, arguments);
      return;
    }
    if (options.data instanceof Array) {
      _successFuncCache && _successFuncCache(data);//appnest.http.formSubmit  返回的数据在data字段里
    }else{
      _successFuncCache && _successFuncCache.apply(this, args);
    }
  };

  options.error = function(error) {
    Loading.hide();
    console.log(arguments);
    var args = arguments;
    if (options.derror) {
      options.derror.apply(this, arguments);
      return;
    }
    Alert.show({
      content: commLang.errorContent,
      showType: "error",
      doOk: function() {
        _errorFuncCache && _errorFuncCache.apply(this, args);
      }
    });
  };
  if (!options.hideLoading) {
    Loading.show();
  }
  //如果提交的参数是数据形式的  调用appnest.http.formSubmit
  if (options.data instanceof Array) {

    return appnest.http.formSubmit(options);
  }else{
    return $.ajax(options);
  }
};

var util = {
  getQueryObj: function(pagePath) {
    if (!pagePath) {
      pagePath = location.hash.replace("#", "");
    }
    var query = pagePath.split("?")[1] || "";
    var seg = query.split("&");
    var obj = {};
    for (var i = 0; i < seg.length; i++) {
      var s = seg[i].split("=");
      obj[s[0]] = router._unescape(s[1]);
    }
    return obj;
  },
  getQueryStr: function(obj) {
    var ps = [];
    obj = obj || {};
    for (var k in obj) {
      var v = obj[k];
      if (v === null || v === "" || v === undefined) {
        continue;
      } else if (v instanceof Array) {
        ps.push(k + "=" + router._escape(v.join(",")));
      } else {
        ps.push(k + "=" + router._escape(v));
      }
    }
    return ps.join("&");
  },
  //登陆之前路径添加access，登陆之后路径添加interface
  getRealUrl:function(url){
    if(window.hasLogin){
      url = common.oaUrl+'interface'+url.replace(common.oaUrl,'');
    }else{
      url = common.oaUrl+'access'+url.replace(common.oaUrl,'');
    }
    return url;
  },
};

fetch.goTo = function(p, params, isForce) {
  var query = util.getQueryStr(params);
  if (query.length > 0) p = p + (p.indexOf("?") > -1 ? "&" : "?") + query;
  location.href = p;
  router.go({
    path: p.replace("#", ""),
    isForce: !!isForce
  });
};

fetch.formatPagination = function() {
  var args = arguments,
    info = {};
  for (var i = 0, len = args.length; i < len; i++) {
    Object.assign(info, args[i]);
  }
  info.pageSize = info.pageSize || 10;
  info.pageNum = info.pageNum || 1;
  return info;
};

fetch.formatOrder = function(orderObj, value) {
  var values = value.split(","),
    k = values[0],
    v = values[1];
  orderObj[k] = Number(v);
};
fetch.getFormData = function(obj) {
  var formData = new FormData();
  if (obj instanceof Array) {
    for (var i = 0, len = obj.length; i < len; i++) {
      var v = obj[i],
        k = v.getAttribute("name");
      formData.append(k, v.files && v.files.length > 0 ? v.files[0] : v.value);
    }
  } else {
    for (var k in obj) {
      formData.append(k, obj[k]);
    }
  }

  return formData;
};

fetch.getBlob = function(content, type) {
  var blob = new Blob([content], { type: type || "text/plain" });
  return blob;
};

fetch.getQueryObj = function() {
  var params = util.getQueryObj();
  delete params.random;
  return params;
};

fetch.reload = function() {
  var params = router.getQueryObj();
  // params.random = Math.random();
  var p = location.hash.split("?")[0];
  fetch.goTo(p, params, true);
};

fetch.redirect = function(url, params) {
  if (url.indexOf("http") !== 0) {
    url = Global.serverBaseUrl + url;
  }
  params = params || {};
  var ps = [];
  for (var k in params) {
    ps.push(k + "=" + escape(params[k]));
  }
  if (ps.length > 0) url += "?" + ps.join("&");
  location.href = url;
};

fetch.extends = function(targetObj, newObj) {
  for (var k in targetObj) {
    if (newObj[k] !== null && newObj[k] !== undefined) {
      targetObj[k] = newObj[k];
    }
  }
};

fetch.config = function(c) {
  config = c;
};
fetch.plusready=function(cb){
  if (window.appnest) {
    appnest.http.clearCookie();//清空cookie
    console.log('清空cookie 成功')
    cb();
  } else {
    document.addEventListener("plusready", function(){
      appnest.http.clearCookie();//清空cookie
      console.log('清空cookie 成功')
      cb();
    });
  }
};
fetch.download= function(opts){
  //获取真正的url
  opts.url = util.getRealUrl(opts.url);

  var _successFuncCache = opts.success,
  _errorFuncCache = opts.error;

  opts.success = function(data, textStatus, request) {
    Loading.hide();
    //处理错误情况
    if(data.errcode=='10001'){
      Alert.show({
          content:'会话超时，重新进入应用',
          doOk: function(){
              appnest.worktable.reloadApp();
          }
      });
      return;
    }
    if(data.errcode=='10000'){
      Alert.show({
          content: data.errmsg,
          showType: "error",
      });
      return;
    }
    var args = arguments;
    _successFuncCache && _successFuncCache.apply(this, args);
  };

  opts.fail = function(error) {
    Loading.hide();
    var args = arguments;
    Alert.show({
      content: commLang.errorContent,
      showType: "error",
      doOk: function() {
        _errorFuncCache && _errorFuncCache.apply(this, args);
      }
    });
  };
  if (!opts.hideLoading) {
    Loading.show();
  }
  appnest.http.download(opts);
};
router._escape = function(v) {
  v = v || "";
  try {
    return encodeURIComponent(v);
  } catch (e) {
    return v;
  }
};

router._unescape = function(v) {
  v = v || "";
  try {
    return decodeURIComponent(v);
  } catch (e) {
    return v;
  }
};
module.exports = fetch;
