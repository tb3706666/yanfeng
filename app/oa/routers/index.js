/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from "@auicomp/page/Page.aui";

import MyLoading from "../pages/MyLoading.aui";
import MainPage from "../pages/MainPage.aui";
import loginHR from "../pages/loginHR.aui";
import loginOA from "../pages/loginOA.aui";

import QingjiaList from "../pages/qingjia/QingjiaList.aui";
import QingjiaFaqiList from "../pages/qingjia/QingjiaFaqiList.aui";
import QingjiaDetail from "../pages/qingjia/QingjiaDetail.aui";
import QingjiaSearch from "../pages/qingjia/qingjiaSearch.aui";
import QingjiaYiban from "../pages/qingjia/QingjiaYiban.aui";
import QingjiaNew from "../pages/qingjia/QingjiaNew.aui";
import Choose from "../pages/qingjia/Choose.aui";
import History from "../pages/qingjia/History.aui";

import JiabanList from "../pages/jiaban/JiabanList.aui";
import JiabanDetail from "../pages/jiaban/JiabanDetail.aui";
import JiabanFaqiList from "../pages/jiaban/JiabanFaqiList.aui";
import JiabanSearch from "../pages/jiaban/JiabanSearch.aui";
import JiabanYiban from "../pages/jiaban/JiabanYiban.aui";
import JiabanNew from "../pages/jiaban/JiabanNew.aui";

import Personal from "../pages/hrquery/Personal.aui";
import Personnel from "../pages/hrquery/Personnel.aui";
import RecordQuery from "../pages/hrquery/RecordQuery.aui";

import ChuchaiList from "../pages/chuchai/ChuchaiList.aui";
import ChuchaiSearch from "../pages/chuchai/ChuchaiSearch.aui";
import ChuchaiDetail from "../pages/chuchai/ChuchaiDetail.aui";
import ForwardPeople from "../pages/chuchai/ForwardPeople.aui";
import CommunicatePeople from "../pages/chuchai/CommunicatePeople.aui";
import ChuchaiNew from "../pages/chuchai/ChuchaiNew.aui";
import Selpeople from "../pages/chuchai/Selpeople.aui";
import Selpeople1 from "../pages/chuchai/Selpeople1.aui";
import Selpeoplejipiao from "../pages/chuchai/Selpeoplejipiao.aui";
import Chengbenzhongxin from "../pages/chuchai/Chengbenzhongxin.aui";
import SelectAirport from "../pages/chuchai/SelectAirport.aui";

import TongyongList from "../pages/tongyong/TongyongList.aui";
import TongyongSearch from "../pages/tongyong/TongyongSearch.aui";
import TongyongDetail from "../pages/tongyong/TongyongDetail.aui";

import ShlcList from "../pages/shlc/ShlcList.aui";
import ShlcDetail from "../pages/shlc/ShlcDetail.aui";

import EwyfList from "../pages/ewyf/EwyfList.aui";
import EwyfSearch from "../pages/ewyf/EwyfSearch.aui";
import EwyfDetail from "../pages/ewyf/EwyfDetail.aui";

import PljbList from "../pages/pljb/PljbList.aui";
import PljbDetail from "../pages/pljb/PljbDetail.aui";
import PljbSearch from "../pages/pljb/PljbSearch.aui";
import PljbYiban from "../pages/pljb/PljbYiban.aui";

import LizhiList from "../pages/lizhi/LizhiList.aui";
import LizhiDetail from "../pages/lizhi/LizhiDetail.aui";
import LizhiSearch from "../pages/lizhi/LizhiSearch.aui";
import LizhiYiban from "../pages/lizhi/LizhiYiban.aui";

router.add([
  {
    path: "/",
    redirect: "/loading"
  },
  {
    path: "/loading",
    component: MyLoading
  },
  {
    path: "/main",
    component: MainPage,
    cache: true
  },
  {
    path: "/loginHR",
    component: loginHR
  },
  {
    path: "/loginOA",
    component: loginOA
  },
  {
    path: "/QingjiaList",
    component: QingjiaList,
    cache: true
  },
  {
    path: "/QingjiaFaqiList",
    component: QingjiaFaqiList,
    cache: true
  },
  {
    path: "/QingjiaSearch",
    component: QingjiaSearch,
    cache: true
  },
  {
    path: "/QingjiaDetail",
    component: QingjiaDetail,
    cache: true
  },
  {
    path: "/QingjiaYiban",
    component: QingjiaYiban
  },
  {
    path: "/QingjiaNew",
    component: QingjiaNew
  },
  {
    path: "/Choose",
    component: Choose
  },
  {
    path: "/History",
    component: History
  },
  {
    path: "/JiabanList",
    component: JiabanList,
    cache: true
  },
  {
    path: "/JiabanFaqiList",
    component: JiabanFaqiList,
    cache: true
  },
  {
    path: "/JiabanDetail",
    component: JiabanDetail,
    cache: true
  },
  {
    path: "/JiabanSearch",
    component: JiabanSearch,
    cache: true
  },
  {
    path: "/JiabanYiban",
    component: JiabanYiban
  },
  {
    path: "/JiabanNew",
    component: JiabanNew
  },
  {
    path: "/Personal",
    component: Personal,
    cache: true
  },
  {
    path: "/Personnel",
    component: Personnel
  },
  {
    path: "/RecordQuery",
    component: RecordQuery
  },
  {
    path: "/ChuchaiList",
    component: ChuchaiList,
    cache: true
  },
  {
    path: "/ChuchaiSearch",
    component: ChuchaiSearch,
    cache: true
  },
  {
    path: "/ChuchaiDetail",
    component: ChuchaiDetail,
    cache: true
  },
  {
    path: "/ForwardPeople",
    component: ForwardPeople
  },
  {
    path: "/CommunicatePeople",
    component: CommunicatePeople
  },
  {
    path: "/ChuchaiNew",
    component: ChuchaiNew,
    cache: true
  },
  {
    path: "/Selpeople",
    component: Selpeople
  },
  {
    path: "/Selpeople1",
    component: Selpeople1
  },
  {
    path: "/Selpeoplejipiao",
    component: Selpeoplejipiao
  },
  {
    path: "/Chengbenzhongxin",
    component: Chengbenzhongxin
  },
  {
    path: "/SelectAirport",
    component: SelectAirport
  },
  {
    path: "/TongyongList",
    component: TongyongList,
    cache: true
  },
  {
    path: "/TongyongSearch",
    component: TongyongSearch,
    cache: true
  },
  {
    path: "/TongyongDetail",
    component: TongyongDetail,
    cache: true
  },
  {
    path: "/ShlcList",
    component: ShlcList,
    cache: true
  },
  {
    path: "/ShlcDetail",
    component: ShlcDetail,
    cache: true
  },
  {
    path: "/EwyfList",
    component: EwyfList,
    cache: true
  },
  {
    path: "/EwyfSearch",
    component: EwyfSearch,
    cache: true
  },
  {
    path: "/EwyfDetail",
    component: EwyfDetail,
    cache: true
  },
  {
    path: "/PljbList",
    component: PljbList,
    cache: true
  },
  {
    path: "/PljbDetail",
    component: PljbDetail,
    cache: true
  },
  {
    path: "/PljbSearch",
    component: PljbSearch,
    cache: true
  },
  {
    path: "/PljbYiban",
    component: PljbYiban
  },
  {
    path: "/LizhiList",
    component: LizhiList,
    cache: true
  },
  {
    path: "/LizhiDetail",
    component: LizhiDetail,
    cache: true
  },
  {
    path: "/LizhiSearch",
    component: LizhiSearch,
    cache: true
  },
  {
    path: "/LizhiYiban",
    component: LizhiYiban
  }
]);

export default router;
