/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';

import MainPage from '../pages/MainPage.aui';
import TitlebarPage from '../pages/TitlebarPage.aui';
import ListPage from '../pages/ListPage.aui';
import ButtonPage from '../pages/ButtonPage.aui';
import BadgesPage from '../pages/BadgesPage.aui';
import TabbarPage from '../pages/TabbarPage.aui';
import DialogPage from '../pages/DialogPage.aui';
import RefresherPage from '../pages/RefresherPage.aui';
import SwiperPage from '../pages/SwiperPage.aui';
import FormPage from '../pages/FormPage.aui';
import ActionPage from '../pages/ActionPage.aui';
import LoginPage from '../pages/LoginPage.aui';
import AjaxListPage from '../pages/AjaxListPage.aui';
import WorkDetail from '../pages/WorkDetail.aui';
import chosePerson from '../pages/chosePerson.aui';
import HlhAdd from '../pages/HlhAddPage.aui';
import MainEdit from '../pages/MainEdit.aui';
import MaximoIndex from '../pages/maximo/MaximoIndex.aui';
import DianJian from '../pages/maximo/dianjian/DianJian.aui';
import yufangList from '../pages/maximo/yufang/yufangList.aui';
import yufangDetail from '../pages/maximo/yufang/yufangDetail.aui';
import guzhangAdd from '../pages/maximo/guzhang/guzhangAdd.aui';
import guzhangQuery from '../pages/maximo/guzhangQuery.aui';
import Xiangqing from '../pages/Xiangqing.aui';
import appIndex from '../pages/appIndex/index.aui';
import addModule from '../pages/appIndex/addModule.aui';
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
        redirect: '/main'
    },
    {
        path: '/main',
        component: MainPage,
        // cache: true // 设置缓存
        // children: [] // 设置子路由，子路由也是形如{path, component, cache?, children?, redirect?:string|function(query)}
    },
    {
        path: '/list',
        component: ListPage
    },
    {
        path: '/button',
        component: ButtonPage
    },
    {
        path: '/badges',
        component: BadgesPage
    },
    {
        path: '/titlebar',
        component: TitlebarPage
    },
    {
        path: '/tabbar',
        component: TabbarPage
    },
    {
        path: '/dialog',
        component: DialogPage
    },
    {
        path: '/refresh',
        component: RefresherPage
    },
    {
        path: '/swiper',
        component: SwiperPage
    },
    {
        path: '/form',
        component: FormPage
    },
    {
        path: '/action',
        component: ActionPage
    },
    {
        path: '/login',
        component: LoginPage
    },
    {
        path: '/ajaxlist',
        component: AjaxListPage
    },
    {
        path: '/workdetail',
        component: WorkDetail,
        cache:true
    },
    {
        path: '/choseperson',
        component: chosePerson
    },
    {
        path: '/hlhadd',
        component: HlhAdd
    },
    {
        path: '/mainEdit',
        component: MainEdit
    },
    {
        path: '/maximo',
        component: MaximoIndex
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
        component: yufangDetail
    },
    {
        path: '/guzhangadd',
        component: guzhangAdd
    },
    {
        path: '/guzhangquery',
        component: guzhangQuery
    },
    {
        path: '/xiangqing',
        component: Xiangqing
    },
    {
        path: '/appindex',
        component: appIndex
    },
    {
        path: '/addmodule',
        component: addModule
    }
]);


export default router;