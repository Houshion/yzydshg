const app = getApp();
const tools = app.tools;
Page({
  data: {
    is_show:false
  },
  onLoad: function (e) {
    
  },
  onReady: function () {
   
  },
  onShow: function () {
    const routes = tools.getStorage('routes');
    console.log('routes='+routes)
    tools.isToken((flag) => {
      if(flag){
        this.is_bind_phone();
      }else{
        this.setData({
          is_show:true
        })
      }
    });
  },
  bindGetUserInfo: function (e) {
    const userInfo = e.detail.userInfo;
    const that = this;
    tools.showLoading('正在登录');
    if (userInfo) { //用户授权
      wx.login({
        success: function (e) {
          console.log(e);
          let code = e.code;
          let data = {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            code: code,
            gender: userInfo.gender
          };
          app.wxRequest('/App/Auth/login', data, function (res) {
            if (res.data.code == 1) {
              const token = res.data.data.token;
              tools.setStorage('token',token);
              that.is_bind_phone()
            } else {
              tools.showToast( '登录失败');
            }
          })
        }
      })
    } else { //用户取消授权
      tools.hideLoading();
    }
  },
  is_bind_phone(){
    const that = this;
    app.wxRequest(
        '/App/User/api', {
          api_name: 'user_info',
          token: tools.getStorage('token')
        },
        (res) => {
          if (res.data.code == 1) {
            if(!res.data.data.mobile){
                tools.reLaunch('/pages/user/bd_phone/index');
            }else{
              const routes = tools.getStorage('routes');
              console.log(routes);
              if(routes){
                tools.reLaunch(routes);
              }else{
                tools.reLaunch('/pages/user/index/index');
              }
            }
          } else {
            tools.showToast(res.data.msg);
          }
        }
    );
  }
})