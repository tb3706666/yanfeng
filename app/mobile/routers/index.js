/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';
import MyLoading from '../pages/MyLoading.aui';
import XiaoiList from '../pages/XiaoiList.aui';
import XiaoiDetail from '../pages/XiaoiDetail.aui';
import XiaoiNew1 from '../pages/XiaoiNew1.aui';
import XiaoiNew2 from '../pages/XiaoiNew2.aui';


import ChooseDept from '../pages/ChooseDept.aui';

router.add([
    {
        path: '/',
        redirect: '/MyLoading'
    },
    {
        path: '/MyLoading',
        component: MyLoading
    },
    {
        path: '/XiaoiList',
        component: XiaoiList,
        cache: true
    },
    {
        path: '/XiaoiDetail',
        component: XiaoiDetail,
    },
    {
        path: '/XiaoiNew2',
        component: XiaoiNew2,
        cache: true
    },
    {
        path: '/XiaoiNew1',
        component: XiaoiNew1,
        cache: true
    },
    {
        path: '/ChooseDept',
        component: ChooseDept
    }
]);


export default router;