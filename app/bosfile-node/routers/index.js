/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';

import InitLoading from '../pages/InitLoading.aui';
// import IndexList from '../pages/IndexList.aui';
import MainList from '../pages/MainList.aui';
import SearchList from '../pages/SearchList.aui';
import WorkDetail from '../pages/WorkDetail.aui';
import choseForwardPerson from '../pages/ChooseForwardPerson.aui';
import chooseCommunicatePerson from '../pages/ChooseCommunicatePerson.aui';
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
        redirect: '/loading',
    },
    {
        path: '/loading',
        component: InitLoading
    },
    {
        path: '/mainlist',
        component: MainList
    },
    // {
    //     path: '/indexlist',
    //     component: IndexList
    // },
    {
        path: '/searchlist',
        component: SearchList,
        cache:true
    },
    {
        path: '/workdetail',
        component: WorkDetail,
        cache:true
    },
    {
        path: '/chooseforwardperson',
        component: choseForwardPerson
    },
    {
        path: '/chooseCommunicateperson',
        component: chooseCommunicatePerson
    }
    
]);


export default router;