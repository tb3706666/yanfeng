/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';


import MaximoIndex from '../pages/MaximoIndex.aui';
import DianJian from '../pages/dianjian/DianJian.aui';
import yufangList from '../pages/yufang/yufangList.aui';
import yufangDetail from '../pages/yufang/yufangDetail.aui'
import guzhangList from '../pages/guzhang/guzhangList.aui';
import guzhangDetail from '../pages/guzhang/guzhangDetail.aui';
import guzhangAdd from '../pages/guzhang/guzhangAdd.aui';
import zichanQuery from '../pages/guzhang/zichanQuery.aui';
import guzhangQuery from '../pages/guzhangQuery.aui';
// 路由添加可以不需要一次添加完毕，可以分开添加，只要在路由跳转前添加即可
// 路由可以由多级
// 路由对应组件可以使用redirect动态加载，比如：
/**
 * {
        path: '/main',
        redirect: function(query){
            // query是hash的参数，比如#main?type=android
            // 可以根据query值来完善逻辑返回对应的组件即可
            return MainPage;
        }
    }
 */
// 每一级路由必须对应的一个aui-page组件，即：A路由有子路由B，则A路由的组件中必须包含aui-page组件，B路由有子路由C，则B路由的组件也必须包含aui-page，具体看Frame.aui
// 第一级路由自动找页面中出现的第一个aui-page组件
router.add([
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/index',
        component: MaximoIndex,
        cache:true
    },
    {
        path: '/dianjian',
        component: DianJian
    },
    {
        path: '/yufang',
        component: yufangList
    },
    {
        path: '/yufangdetail',
        component: yufangDetail,
        cache:true
    },
    {
        path: '/guzhanglist',
        component: guzhangList
    },
    {
        path: '/guzhangdetail',
        component: guzhangDetail,
        cache:true
    },
    {
        path: '/guzhangadd',
        component: guzhangAdd,
        cache:true
    },
    {
        path: '/guzhangquery',
        component: guzhangQuery
    },
    {
        path: '/zichanquery',
        component: zichanQuery
    }
    
]);


export default router;