// 此文件将生成用于require.js的基础组件文件
// 必须引入start
import 'aui-loader/dist/aui'; // 导入aui-loader的requirejs版
import 'agile-ui'; // 引入agile-ui，内含requirejs支持
// 必须引入end



// 引入必要组件，可直接通过aui-tag调用，或者window.auicomponents.ClassName调用
import '@auicomp/header/Header.aui';
import '@auicomp/footer/Footer.aui';
import '@auicomp/scroller/Scroller.aui';
import '@auicomp/titlebar/Titlebar.aui';
import '@auicomp/list/List.aui';
import '@auicomp/action/Action.aui';
import '@auicomp/page/Page.aui';
import '@auicomp/tabbar/Tabbar.aui';

require('@auifont/iconfont.css');

// 引入路由，不是必须，Page组件类的静态方法router即为router，一般可通过Page类获取
const router = require('@auiutil/router');

module.exports = {
    router: router,
    $: require('agile-ce')
}