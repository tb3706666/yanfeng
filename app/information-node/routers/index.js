

import { router } from '@auicomp/page/Page.aui';
import InitLoading from '../pages/InitLoading.aui';
import Information from '../pages/Information.aui';

router.add([
    {
        path: '/',
        redirect: '/loading',
    },
    {
        path: '/loading',
        component: InitLoading,
    },
    {
        path: '/detail',
        component: Information,
    },
   
]);


export default router;