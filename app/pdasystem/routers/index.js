/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from "@auicomp/page/Page.aui";
import Detail from "../pages/Detail.aui";
import Templates from "../pages/Templates.aui";
import MainPage from "../pages/MainPage.aui";
import MyLoading from "../pages/MyLoading.aui";
import Login from "../pages/Login.aui";
import Oneitem from "../pages/Oneitem.aui";






router.add([
  {
    path: "/",
    redirect: "/MyLoading"
  },
  {
    path: "/MyLoading",
    component: MyLoading,
  },
  {
    path: "/Login",
    component: Login,
  },
  {
    path: "/MainPage",
    component: MainPage,
    cache: true
  },
  {
    path: "/Detail",
    component: Detail,
    cache: true
  },
  {
    path: "/Templates",
    component: Templates,
    cache: true
  },
  {
    path: "/Oneitem",
    component: Oneitem,
  },
]);


export default router;
