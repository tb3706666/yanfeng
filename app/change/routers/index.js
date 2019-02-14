/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from '@auicomp/page/Page.aui';

import Add from '../pages/Add.aui';

router.add([
    {
        path: '/',
        redirect: '/add'
    },
    {
        path: '/add',
        component: Add
    }
]);


export default router;