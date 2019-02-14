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
    config.success = function() {
      console.log("配置成功");
      // alert(appnest.exmobiHttp.exitApp);
      // 第二步：调用退出app方法以清除cookie
      appnest.exmobiHttp.exitClient({
        // appId: 'bosfile_test',
        success: function() {
          // 第三步：初始化exmobi客户端，相当于启动exmobi客户端（但是还没打开应用）
          appnest.exmobiHttp.init({
            success: function() {
              console.log("初始化成功");
              isinit = true;
              resolve(true);
            }
          });
        }
      });
    };
    // 第一步：设置服务器信息，类似于exmobi客户端的系统设置，注意setConfigInit不可设置多个，好比exmobi客户端只有一个系统设置，修改设置需要重启客户端一样
    appnest.exmobiHttp.setConfigInfo(config);
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
var getToken = function(cb) {
  appnest.config.getTokenInfo({
    success: function(res) {
      var resObj = {};
      resObj.token = res.token; // 身份认证唯一标识
      // var tokentimeout= res.tokentimeout;//身份认证超时时间 如 3600，单位：秒
      cb(resObj);
    },
    fail: function(res) {
      alert("获取token失败");
    }
  });
};

/**
 * 获取AppNest登录用户信息
 * return {
 *           userName:'zhangsan',//用户姓名
 *           password:'123456',//密码
 *           loginId:'zhansan',//登录帐号
 *           imAccount:'zs001',//im帐号
 *           photoUrl:'http://xxxx.png',//头像地址
 *           orgName:'启迪国信',//公司名称
 *           departments:[
 *              {id:'901023',name:'AppNest交付部',type:0},
 *              {id:'901224',name:'研发部',type:1}
 *           ]
 *        }
 */
var getUserInfo = function(cb) {
  appnest.config.getUserInfo({
    success: function(res) {
      cb(res);
    },
    fail: function(res) {
      alert("获取用户信息失败");
    }
  });
};

fetch.getToken = function(cb) {
  promiseAppnest(function() {
    getToken(cb);
  });
};
fetch.getUserInfo = function(cb) {
  promiseAppnest(function() {
    getUserInfo(cb);
  });
};

var util = {
  ajax: function(opts) {
    appnest.exmobiHttp.ajax(opts);
  },
  formSubmit: function(opts) {
    appnest.exmobiHttp.formSubmit(opts);
  },
  download: function(opts) {
    appnest.exmobiHttp.download(opts);
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

      if (opts.dataType === "text") {
        // 默认dataType为json，非json一律当成普通文本，请自行处理
        return opts.success && opts.success(rsData);
      }
      // 默认dataType为json
      try {
        var json = $.JSON.parse(rsData.trim());
        // 如果对返回数据有格式要求，比如错误码，请在此处理，比如
        /**
                 * 错误码为0代表请求成功
                if(json.errcode!==0){
                    alert(json.errmsg || '请求错误');
                    opts.error && opts.error(json);
                    return;
                }
                 */
        opts.success && opts.success(json);
      } catch (e) {
        console.error(e)
        Alert.show({
          content: "返回数据格式错误",
          showType: "error",
          doOk: function() {}
        });
      }
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
