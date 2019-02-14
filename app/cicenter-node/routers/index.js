

import { router } from '@auicomp/page/Page.aui';
import CILoading from '../pages/CILoading.aui';
import CIcenter from '../pages/CIcenter.aui';
import SelectPage from '../pages/SelectPage.aui';
import HLS from '../pages/HLS.aui';
import JifenPage from '../pages/JifenPage.aui';
import HLListPage from '../pages/HLListPage.aui';
import OtherPage from '../pages/OtherPage.aui';
import SelectManPage from '../pages/SelectManPage.aui';
import Department from '../pages/Department.aui';
import Department_hlh from '../pages/Department_hlh.aui';
import JiFenList from '../pages/JiFenList.aui';
import HLSList from '../pages/HLSList.aui';
import HLSDetail from '../pages/HLSDetail.aui';
import HL_Detail from '../pages/HL_Detail.aui';
import SelectList from '../pages/SelectList.aui';
import EvalPage from '../pages/EvalPage.aui';
import EvalList from '../pages/EvalList.aui';
import EvalDetail from '../pages/EvalDetail.aui';
import HlhAdd from '../pages/HlhAddPage.aui';
import ChoosePerson from '../pages/ChoosePerson.aui';
import ChoosePerson_hlh from '../pages/ChoosePerson_hlh.aui';
import Other_Detail from '../pages/Other_Detail.aui';
import SelectDetail from '../pages/SelectDetail.aui';
import HlhEdit from '../pages/HlhEdit.aui';
import OtherEdit from '../pages/OtherEdit.aui';
router.add([
    {
        path: '/',
        redirect: '/ciloading'
    },
    {
        path: '/ciloading',
        component: CILoading,
    },
    {
        path: '/cicenter',
        component: CIcenter,
        // cache:true
    },
    {
        path: '/select',
        component: SelectPage,
        cache:true
    },
    {
        path: '/hls',
        component: HLS,
        cache:true
    },
    {
        path: '/jifen',
        component: JifenPage,
        cache:true
    },
    {
        path: '/hlhadd',
        component: HlhAdd,
      	cache:true
    },
    {
        path: '/hllist',
        component: HLListPage
    },
    {
        path: '/other',
        component: OtherPage
    },
    {
        path: '/selectman',
        component: SelectManPage
    },
    {
        path: '/chooseperson',
        component: ChoosePerson
    },
    {
        path: '/chooseperson_hlh',
        component: ChoosePerson_hlh
    },
    {
        path: '/department',
        component: Department
    },
    {
        path: '/department_hlh',
        component: Department_hlh
    },
    {
        path: '/jifenlist',
        component: JiFenList
    },
    {
        path: '/hlslist',
        component: HLSList
    },
    {
        path: '/hlsdetail',
        component: HLSDetail
    },
    {
        path: '/hl_detail',
        component: HL_Detail,
        cache:true
    },
    {
        path: '/selectlist',
        component: SelectList
    },
    {
        path: '/eval',
        component: EvalPage,
        cache:true
    },
    {
        path: '/evallist',
        component: EvalList
    },
    {
        path: '/evaldetail',
        component: EvalDetail
    },
    {
        path: '/other_detail',
        component: Other_Detail,
        cache:true
    },
    {
        path: '/selectdetail',
        component: SelectDetail
    },
    {
        path: '/hlhedit',
        component: HlhEdit,
        cache:true
    },
    {
        path: '/otheredit',
        component: OtherEdit,
        cache:true
    }
   
]);


export default router;