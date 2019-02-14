/**
 * 路由配置，在路由跳转前路由必须先添加，否则将找不到路由
 */

import { router } from "@auicomp/page/Page.aui";
import MyLoading from "../pages/MyLoading.aui";
import MainPage from "../pages/MainPage.aui";
import Webview from "../pages/Webview.aui";




router.add([
  {
    path: "/",
    redirect: "/MyLoading"
  },
  {
    path: "/MyLoading",
    component: MyLoading
  },
  {
    path: "/MainPage",
    component: MainPage,
    cache: true
  },
  {
    path: "/Webview",
    component: Webview,
  }
]);

export default router;
