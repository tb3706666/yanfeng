import commLang from "@lang/comm";
import Alert from "@auicomp/alert/Alert.aui";
import { router } from "@auicomp/action/Action.aui";
import Loading from "@auicomp/loading/Loading.aui";
var config;

var isinit = false;

// 初始化内部自动调用
function init() {
  // 如果已经初始化则不需要重复初始化
  if (isinit) return Promise.resolve(true);
  if (typeof appnest === "undefined") {
    alert("请在appnest中使用，并且确保在ready事件触发之后使用");
    return Promise.reject();
  } else if (!config) {
    alert("请先调用fetch.config方法配置参数");
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    // 第一步：清除cookie
    appnest.http.clearCookie()
    console.log("初始化成功");
    isinit = true;
    resolve(true);
  });
}

var promiseAppnest = function(cb) {
  //监听AppNest JSApi加载完成事件
  if (!window.appnest) {
    $(document).on("ready", function() {
      cb();
    });
  } else {
    cb();
  }
};

var util = {
  ajax: function(opts) {
    appnest.http.ajax(opts);
  },
  formSubmit: function(opts) {
    appnest.http.formSubmit(opts);
  },
  download: function(opts) {
    appnest.http.download(opts);
  }
};

function getRequestConfig(data) {
  if (!data || typeof data === "string") {
    // 如果没有提交参数或者参数是字符串，直接用ajax类提交
    return {
      type: "ajax",
      data: data
    };
  } else if (data instanceof Array) {
    // 如果提交的是形如：
    /*
        [
            {
                type: 0,
                name: 'display_name',
                value: 'test'
            },
            {
                type: 0,
                name: 'iconfont_name',
                value: 'test'
            },
            {
                type: 0,
                name: 'is_private',
                value: '1'
            },
            {
                type: 1,
                name: 'iconfont_file',
                value: filePath
            }
        ]
        */
    // 的数据则认为是带文件表单提交
    return {
      type: "formSubmit",
      data: data
    };
  }
  // 都不是的请求就把参数转成键值对参数，用ajax提交
  var params = [];
  for (var k in data) {
    // params.push(k + "=" + encodeURIComponent(data[k]));
    params.push(k + "=" + data[k]);
  }
  return {
    type: "ajax",
    data: params.join("&")
  };
}

function fetch(opts, isInit) {
  if (!isInit) {
    return init().then(function(rs) {
      if (!rs) return;
      fetch(opts, true);
    });
  }
  var requestConfig = getRequestConfig(opts.data);
  var options = {
    appId: opts.appId,
    url: opts.url,
    data: requestConfig.data,
    method: "post" || opts.type, // 默认请求为post，如果为get请求需设置
    success: function(rs) {
      Loading.hide();
      var rsData = rs.data;
      console.log(rsData);
      // 默认dataType为json，非json一律当成普通文本，请自行处理
      return opts.success && opts.success(rsData);
    },
    fail: function(rs) {
      Loading.hide();
      if(rs.errMsg.indexOf('1032') > -1 && rs.errMsg.indexOf('应用会话超时') > -1){
        Alert.show({
            // content:JSON.parse(rs.errMsg.trim()).faultstring,
            content:'会话超时，重新进入应用',
            doOk: function(){
                appnest.worktable.reloadApp();
            }
        });
      }else{
        Alert.show({
          content: rs.errMsg,
          showType: "error",
          doOk: function() {
            opts.error && opts.error();
          }
        });
      }
    }
  };

  if (opts.headers) options.requestHeader = opts.headers;

  // isBlock、timeout、connectTimeout、reqCharset、rspCharset等参数请自行实现
  if (opts.timeout) options.timeout = opts.timeout;

  if (opts.connectTimeout) options.connectTimeout = opts.timeout;

  if (opts.reqCharset) options.reqCharset = opts.reqCharset;
  if (!opts.hideLoading) {
    Loading.show();
  }
  util[requestConfig.type](options);
}

// 在调用fetch方法的时候必须先调用fetch.config方法进行配置
fetch.config = function(opts) {
  config = opts;
};

// 下载方法基本跟appnest方法一致支持错误回调是error
fetch.download = function(opts, isInit) {
  if (!isInit) {
    return init().then(function(rs) {
      if (!rs) return;
      fetch.download(opts, true);
    });
  }
  var options = {
    appId: opts.appId,
    url: opts.url,
    fileName: opts.fileName,
    path: opts.path,
    success: function(rs) {
      opts.success && opts.success(rs);
    },
    fail: function(rs) {
      rs.errmsg = rs.errMsg;
      opts.error && opts.error(rs);
    }
  };

  util.download(options);
};

var isReady = false,
  readyFuncs = [];
function readyHandler() {
  if (!window.appnest) return;
  init().then(function() {
    var func;
    while ((func = readyFuncs.shift())) {
      func();
    }
  });
}

fetch.plusready = function(cb) {
  if (window.appnest) {
    cb();
  } else {
    if (!isReady) {
      // 旧版事件
      document.addEventListener("ready", readyHandler);
      // 新版事件，以后新开发应用只监听plusready
      document.addEventListener("plusready", readyHandler);
      isReady = true;
    }
    readyFuncs.push(cb);
  }
};

// document.addEventListener('ready', function(){

// });

// fetch.plusready(function(){

// });

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

/**
    // 用法示例

    // 引入xfetch.js
    var fetch = require('@comm/utils/xfetch');

    // 整个app初始化的时候调用fetch.config进行配置
    fetch.config({
        ip: 'mobile.yanfengadient.com',
        port: '8001',
        sslPort: '',
        isSsl: '',
        phone: '',
        userName: '',
        ec: 'yfjc',
    });

    // 某个逻辑发起ajax post请求
    fetch({
        appId: 'dakajilu',
        url : 'https://dzzw/personrecordQuery.jsp',
		data: {
            username: 82984
        },
		success: function(json){
            // 由于没有设置dataType，要求返回必须json字符串，回调里得到的是其对应格式化后的json对象
            alert(JSON.stringify(json));
        },
		error: function(rs){
            alert(rs.errmsg);
        }
    });

    // 某个逻辑发起ajax get请求
    fetch({
        appId: 'dakajilu',
        url : 'https://dzzw/getlist.jsp',
		data: {
            username: 82984
        },
        type: 'get',
		success: function(json){
            // 由于没有设置dataType，要求返回必须json字符串，回调里得到的是其对应格式化后的json对象
            alert(JSON.stringify(json));
        },
		error: function(rs){
            alert(rs.errmsg);
        }
    });

    // 某个逻辑发起formSubmit 提交文件
    fetch({
        appId: 'test',
        url: 'http://baseurl/upload',
		data: [
			{
				type: 0,
				name: 'display_name',
				value: 'test'
			},
			{
				type: 0,
				name: 'iconfont_name',
				value: 'test'
			},
			{
				type: 0,
				name: 'is_private',
				value: '1'
			},
			{
				type: 1,
				name: 'iconfont_file',
				value: 'file://c:/XXX.png'
			}
		],
		success: function(json){
            // 由于没有设置dataType，要求返回必须json字符串，回调里得到的是其对应格式化后的json对象
            alert(JSON.stringify(json));
        },
		error: function(rs){
            alert(rs.errmsg);
        }
    });

    // 某个逻辑发起download 下载文件
    fetch.download({
        appId: 'test',
        url : 'http://baseurl/download',
        fileName: 'test.log',
        path: 'res:download',
		success: function(rs){
            alert(rs.path);
        },
		error: function(rs){
            alert(rs.errmsg);
        }
    });

 */
