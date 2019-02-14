/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from "@auicomp/page/Page.aui";
import MainPage from "../pages/MainPage.aui";
import Gdsj from "../pages/Gdsj.aui";
import GdsjXscl from "../pages/GdsjXscl.aui";
import GdsjWlxx from "../pages/GdsjWlxx.aui";






router.add([
  {
    path: "/",
    redirect: "/MainPage"
  },
  {
    path: "/MainPage",
    component: MainPage,
  },
  {
    path: "/Gdsj",
    component: Gdsj,
    cache: true
  },
  {
    path: "/GdsjXscl",
    component: GdsjXscl,
  },
  {
    path: "/GdsjWlxx",
    component: GdsjWlxx,
  },
  
]);


export default router;
