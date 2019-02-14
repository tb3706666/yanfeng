import Alert from "@auicomp/alert/Alert.aui";

import { router } from "@auicomp/action/Action.aui";

import commLang from "@lang/comm";
import Loading from "@auicomp/loading/Loading.aui";
import common from "@libs/common";
var config;

var baseUrl = location.host;
function getRequestConfig(data) {
  if (!data || typeof data === "string") {
    // 如果没有提交参数或者参数是字符串，直接用ajax类提交
    return {
      type: "ajax",
      data: data
    };
  } else if (data instanceof Array) {
    return {
      type: "formSubmit",
      data: data
    };
  }
  // 都不是的请求就把参数转成键值对参数，用ajax提交
  var params = [];
  for (var k in data) {
    params.push(k + "=" + data[k]);
  }
  return {
    type: "ajax",
    data: params.join("&")
  };
}
var fetch = function(opts) {
  // 自动补全url
  if (!/^https?\:\/\//.test(opts.url)) {
    opts.url = config.serverBaseUrl + opts.url;
  }
  //获取真正的url
  opts.url = util.getRealUrl(opts.url);
  //获取真正的data
  var requestConfig = getRequestConfig(opts.data);
  var options = {
    url: opts.url,
    data: requestConfig.data,
    method:   opts.type||"post", // 默认请求为post，如果为get请求需设置
    success: function(rs) {
      Loading.hide();
      var data;
      var rsData = rs.data;
      if (options.dataType === "text") {
          data = rsData;
      }else{
        data = JSON.parse(rsData);
      }
      //处理错误情况
      if(data.errcode&&data.errcode=='10001'){
        Alert.show({
            content:'会话超时，重新进入应用',
            doOk: function(){
                appnest.worktable.reloadApp();
            }
        });
        return;
      }
      if(data.errcode&&data.errcode=='10000'){
        Alert.show({
            content: data.errmsg,
            showType: "error",
        });
        return;
      }
      opts.success && opts.success(data);
    },
    fail: function(rs) {
      Loading.hide();
      Alert.show({
        content: commLang.errorContent,
        showType: "error",
        doOk: function() {
          opts.error && opts.error();
        }
      });
    }
  };
  if (opts.headers) options.requestHeader = opts.headers;
  if (opts.timeout) options.timeout = opts.timeout;
  if (opts.connectTimeout) options.connectTimeout = opts.timeout;
  if (opts.reqCharset) options.reqCharset = opts.reqCharset;

  if (!opts.hideLoading) {
    Loading.show();
  }
  //如果提交的参数是数据形式的  调用appnest.http.formSubmit
  if (opts.data instanceof Array) {
    return appnest.http.formSubmit(options);
  }else{
      return appnest.http.ajax(options);
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
