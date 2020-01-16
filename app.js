//app.js
import tools from './utils/tools.js';
App({
  onLaunch: function (opt) {

  },
  onShow: function (opt) {
    this.tools = tools;//全局注入tools.js
  },
  /*
   cb(flag, name, result, data)
   name 为自已定义的标识符，回调会原样返回

   flag = 1  选择文件成功，result选择的结果，状态显示为正在上传文件
   flag = -1 选择文件失败，result为失败结果

   flag = 2 为上传文件成功，result为文件id传给服务器, data为上传文件src等详细数据
   flag = -2 为上传文件失败，result为失败结果
   flag = -3 为文件保存失败，result为失败原因

   flag = -4 最多只能上传10张
   */
  uploadFile: function (name, cb, data, params, count,_url='/App/User/api') {//name自定标识,cb回调函数,data其它表单json,params chooseImage参数{count:1}
    var that = this;
    var count;
    var img = [];
    console.log(count)
    var chooseParams = {
      count: count,
      success: function (res1) {
        console.log(res1);
        typeof cb == "function" && cb(1, name, res1);
        var tempFilePaths = res1.tempFilePaths;
        for (var tempFileIndex in tempFilePaths) {
          tools.showLoading('上传中');
          wx.uploadFile({
            url: tools.globalData.url + _url,
            filePath: tempFilePaths[tempFileIndex],
            name: 'img',
            formData: data || {},
            success: function (res3) {
              console.log(res3);
              res3 = res3.data;
              res3 = res3.trim();
              res3 = JSON.parse(res3);
              res3 = res3.data;
              console.log(res3);
              typeof cb == "function" && cb(2, name, res3);
            },
            fail: function (res2) {
              typeof cb == "function" && cb(-2, name, res2);
            }
          })
        }
      },
      fail: function (res1) {
        typeof cb == "function" && cb(-1, name, res1);
      }
    };
    if (typeof params == 'object') {
      for (var i in params) chooseParams[i] = params[i];
    }
    wx.chooseImage(chooseParams)
  },
  //请求接口
  wxRequest: function (url, data, successCB, failCB) {
    var that = this;
    var requestUrl = tools.globalData.url + url;
    var requestMethod = 'POST';
    var requestConType = 'application/x-www-form-urlencoded';
    if (typeof url != 'string') {
      requestUrl = url.url;
      requestMethod = url.method;
      requestConType = url.conType;
    }
    wx.request({
      url: requestUrl,
      header: {
        'content-type': requestConType
      },
      data: data,
      method: requestMethod,
      success: function (res) {
        if (res.data.code == 101) {
          tools.hideLoading();
          tools.removeStorage('token');
          if(tools.globalData.no_user){
             tools.reLaunch('/'+tools.globalData.routes);
          }
           return ;
        }
        typeof successCB == "function" && successCB(res);
      },
      fail: function (res) {
        tools.hideLoading();
        typeof failCB == "function" && failCB(res);
      }
    })
  },
  globalData: { },
})
