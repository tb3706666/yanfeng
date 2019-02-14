/**
 * 此文件为应用的入口文件，一般做初始化用
 */
// 全局引入agile-ce，因为agile-ce自动挂接$操作符到window对象，其他页面可直接全局使用
import 'agile-ce';

// 引入Frame组件
import './pages/Frame.aui';

// 定义fetch工具类，主要用于发起网络请求
import fetch from '@comm/utils/fetch';
// 定义config应用配置
import config from '@libs/config';

/**
 * fetch共用，所以url补全需要各个应用自行设置，要求config中必须包含serverBaseUrl属性，网络请求自定补全该url前缀
 * 比如：
    fetch({
        url: 'access/login'
    })
    则实际请求的url地址为${config.serverBaseUrl}access/login
    注意：
    1. fetch默认请求方式是post，建议所有请求都用post（图片、文件下载除外）
    2. fetch请求响应默认是json格式字符串，成功回调里将得到对应的json对象
    3. fetch要求响应包含{errcode,errmsg}，errcode为0则成功，否则失败
 */
fetch.config(config);

// 将Frame组件添加到页面，注意，组件使用之前必须先引入
$('#app').html('<aui-frame></aui-frame>');

