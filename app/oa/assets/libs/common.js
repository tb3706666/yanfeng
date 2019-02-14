import Alert from "@auicomp/alert/Alert.aui";
import Toast from "@auicomp/toast/Toast.aui";
import Confirm from "@comp/confirm/Confirm.aui";
import fetch from "@libs/xfetch";

export default {
  appId: "yfjs",
  oaUrl: "http://baseurl",
  hrUrl: "https://dzzw",
  hrNewUrl: "http://hrnewwebserviceurl",
  alert: function(msg, cb) {
    Alert.show({
      content: msg,
      doOk: function() {
        if (typeof cb == "function") {
          cb();
        }
      }
    });
  },
  openAttach(url, fileName) {
    let self = this;
    fetch.download({
      appId: this.appId,
      url: url,
      fileName: fileName,
      path: "res:download",
      success: function(rs) {
        appnest.native.openFile({
          path: rs.path //需要打开本地文件地址路径，支持全路径或res:前缀路径
        });
      },
      error: function(rs) {
        self.alert(rs.errmsg);
      }
    });
  },
  getCurrData: function(str) {
    var data;
    if (str) {
      data = new Date(str);
    } else {
      data = new Date();
    }

    return (
      data.getFullYear() +
      "-" +
      this.add0(data.getMonth() + 1) +
      "-" +
      this.add0(data.getDate())
    );
  },
  getCurrTime: function(str) {
    var data;
    if (str) {
      data = new Date(str);
    } else {
      data = new Date();
    }
    return (
      data.getFullYear() +
      "-" +
      this.add0(data.getMonth() + 1) +
      "-" +
      this.add0(data.getDate()) +
      " " +
      this.add0(data.getHours()) +
      ":" +
      this.add0(data.getMinutes()) +
      ":" +
      this.add0(data.getSeconds())
    );
  },
  add0: function(str) {
    return parseInt(str) < 10 ? "0" + parseInt(str) : parseInt(str);
  },
  toast: function(str, cb) {
    Toast.show(str, function() {
      if (typeof cb == "function") {
        cb();
      }
    });
  },
  confirm: function(str, okText, cancelText, cb1, cb2) {
    Confirm.show({
      content: str,
      okText: okText,
      cancelText: cancelText,
      doOk: function() {
        if (typeof cb1 == "function") {
          cb1();
        }
      },
      doCancel: function() {
        if (typeof cb2 == "function") {
          cb2();
        }
      }
    });
  },
  openCamera: function(cb) {
    let self = this;
    //拍照
    appnest.photo.camera({
      width: 400, // 拍照后生成图片宽度,高度按等比例压缩,单位px
      success: function(photores) {
        //获取base64编码图
        appnest.photo.getBase64Image({
          imagePath: photores.thumbnailPath, // 图片全路径
          success: function(res) {
            photores.data = res.data;
            if (typeof cb == "function") {
              cb(photores);
            }
          },
          fail: function(res) {
            self.alert(res.errMsg);
          }
        });
      },
      fail: function(photores) {
        self.alert(photores.errMsg);
      }
    });
  },
  customAlbum: function(length, cb) {
    let self = this;
    appnest.photo.customAlbum({
      max: 5 - length, //最多支持选择图片个数
      width: 400, // 拍照后生成图片宽度,高度按等比例压缩,单位px
      success: function(photores) {
        let imagePaths = photores.imagePaths; // 返回选定照片的本地路径数组
        let thumbnailPaths = photores.thumbnailPaths; // 返回选定缩略图的本地路径列表i++
        let imgdata = [];
        let count = 0;
        for (let i = 0; i < thumbnailPaths.length; i++) {
          //获取base64编码图
          appnest.photo.getBase64Image({
            imagePath: thumbnailPaths[i], // 图片全路径
            success: function(res) {
              imgdata[i] = res.data;
              count++;
              if (count == thumbnailPaths.length) {
                let data = [];
                for (let j = 0; j < thumbnailPaths.length; j++) {
                  data.push({
                    imagePath: imagePaths[j],
                    thumbnailPath: thumbnailPaths[j],
                    data: imgdata[j]
                  });
                }
                cb(data);
              }
            },
            fail: function(res) {
              self.alert(res.errMsg);
            }
          });
        }
      },
      fail: function(photores) {
        this.alert(photores.errMsg);
      }
    });
  },
  previewImg(urls, index) {
    appnest.photo.preview({
      urls: urls, // 需要预览的图片集数组
      index: index //默认展示1索引
    });
  },
  closeApp() {
    appnest.navigation.closeWindow();
  },
  selectFile(cb) {
    let self = this;
    appnest.ui.selectFile({
      max: 1,
      success: function(res) {
        cb(res.filePaths[0]); // 用户选择本地文件路径数组
      },
      fail: function(res) {
        self.alert(res.errMsg);
      }
    });
  },
  compareDate(start, end) {
    let temp1 = new Date(start);
    let temp2 = new Date(end);
    return temp2.getTime() < temp1.getTime();
  },
  //详情返回列表页面时，将缓存的详情页面删除
  removeCachePage() {
    $("aui-ChuchaiNew").remove();
    $("aui-ChuchaiDetail").remove();
    $("aui-EwyfDetail").remove();
    $("aui-JiabanDetail").remove();
    $("aui-QingjiaDetail").remove();
    $("aui-ShlcDetail").remove();
    $("aui-TongyongDetail").remove();
    $("aui-PljbDetail").remove();
    $("aui-LizhiDetail").remove();
  },
  //待办里列表返回主页时，将待办列表删除
  removeCacheListPage() {
    $("aui-QingjiaList").remove();
    $("aui-JiabanList").remove();
    $("aui-Personal").remove();
    $("aui-ChuchaiList").remove();
    $("aui-TongyongList").remove();
    $("aui-ShlcList").remove();
    $("aui-EwyfList").remove();
    $("aui-PljbList").remove();
    $("aui-LizhiList").remove();
  },
  //搜索、发起列表返回待办列表页面时，将搜索、发起列表删除
  removeCacheListSearchPage() {
    $("aui-QingjiaFaqiList").remove();
    $("aui-QingjiaSearch").remove();
    $("aui-JiabanFaqiList").remove();
    $("aui-JiabanSearch").remove();
    $("aui-ChuchaiSearch").remove();
    $("aui-TongyongSearch").remove();
    $("aui-EwyfSearch").remove();
    $("aui-PljbSearch").remove();
    $("aui-LizhiSearch").remove();
  },
  //android返回键点击时删除模态框
  closeModal() {
    appnest.navigation.setBackListen({
      active: 1 //开发者自定义监听
    });
    document.addEventListener("back", function() {
      $("aui-loading").remove();
      $("aui-actionsheet").remove();
      $("aui-selectsheet").remove();
      $("aui-alert").remove();
      $("aui-confirm").remove();
      appnest.navigation.canBack({
        success: function(res) {
          var result = res.code; //当前浏览器是否支持返回上一页 ,0：不支持；1：支持
          if (result == 1) {
            appnest.navigation.goBack();
          } else {
            appnest.navigation.closeWindow();
          }
        },
        fail: function(res) {}
      });
    });
  }
};
