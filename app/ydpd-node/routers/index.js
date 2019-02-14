/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';

import List from '../pages/List.aui';

import Detail from '../pages/Detail.aui';

import Add from '../pages/Add.aui';
router.add([
    {
        path: '/',
        redirect: '/list'
    },
    {
        path: '/list',
        component: List,
        cache:true
    },
    {
        path: '/detail',
        component: Detail,
        cache:true
    },
    {
        path: '/adds',
        component: Add
    }
]);


export default router;