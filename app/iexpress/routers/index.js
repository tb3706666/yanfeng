

import { router } from '@auicomp/page/Page.aui';
import Iexpress from '../pages/Iexpress.aui';
import Addform from '../pages/Addform.aui';
import MyIdea from '../pages/MyIdea.aui';
import Biaoqianyun from '../pages/Biaoqianyun.aui';
import Huodong from '../pages/Huodong.aui';
import Xiangqing from '../pages/Xiangqing.aui'; 
import Weijie from '../pages/Weijie.aui'; 
import Jifen from '../pages/Jifen.aui'; 
import InitLoading from '../pages/InitLoading.aui'; 
import SearchTag from '../pages/SearchTag.aui'; 
import Suggestion from '../pages/Suggestion.aui'; 
import Introduction from '../pages/Introduction.aui'; 
import Detail from '../pages/Detail.aui'; 
import MShare from '../pages/MShare.aui'; 
import SearchList from '../pages/SearchList.aui'; 
import Bydepartment from '../pages/Bydepartment.aui'; 
import MyDeal_Detail from '../pages/MyDeal_Detail.aui'; 
import MyMsg from '../pages/MyMsg.aui'; 
import newIdea from '../pages/newIdea.aui';
router.add([
    {
        path: '/',
        redirect: '/initloading',
    },
    {
        path: '/initloading',
        component: InitLoading,
    },
    {
        path: '/iex',
        component: Iexpress,
        cache:true
    },
    {
        path: '/add',
        component: Addform,
    },
    {
        path: '/addnew',
        component: newIdea
    },
    {
        path: '/myidea',
        component: MyIdea,
        cache:true
    },
    {
        path: '/bqy',
        component: Biaoqianyun,
        cache:true
    },
    {
        path: '/hd',
        component: Huodong,
        cache:true
    },
    {
        path: '/xiang',
        component: Xiangqing,
    },
    {
        path: '/weijie',
        component: Weijie,
    },
    {
        path: '/jifen',
        component: Jifen,
    },
    {
        path: '/searchtag',
        component: SearchTag,
    },
    {
        path: '/suggestion',
        component: Suggestion,
        cache:true
    },
    {
        path: '/introduction',
        component: Introduction,
        cache:true
    },
    {
        path: '/detail',
        component: Detail,
    },
    {
        path: '/mshare',
        component: MShare,
        cache:true
    },
    {
        path: '/searchlist',
        component: SearchList,
        cache:true
    },
    {
        path: '/bydepartment',
        component: Bydepartment,
    },
    {
        path: '/mydeal_detail',
        component: MyDeal_Detail,
    },
    {
        path: '/mymsg',
        component: MyMsg,
    }
]);


export default router;