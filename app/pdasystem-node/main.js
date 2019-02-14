/**
 * 此文件为应用的入口文件，一般做初始化用
 */
// 全局引入agile-ce，因为agile-ce自动挂接$操作符到window对象，其他页面可直接全局使用
import "agile-ce";

// 引入Loading组件
import "./pages/Frame.aui";




// 将loading加入页面
$("#app").html("<aui-frame></aui-frame>");
