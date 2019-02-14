

import { router } from '@auicomp/page/Page.aui';

import Daka from '../pages/Daka.aui';
import InitLoading from '../pages/InitLoading.aui';
import Stafflist from '../pages/Stafflist.aui';

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
        path: '/daka',
        component: Daka,
    },
    {
        path: '/stafflist',
        component: Stafflist
    },
   
]);


export default router;