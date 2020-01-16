const app = getApp();
const tools = app.tools;
// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    val:{
      type:String,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_show:false
  },
  observers:{
    'val':function (res) {
      console.log(res)
      if(res){
        this.show();
      }
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.show();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show(){
      const that = this;
      tools.hideLoading();
      tools.isToken((flag) => {
        if(flag){
          // if (tools.globalData.share) {
          //   that.setData({ is_show: false });
          //   tools.globalData.share = '';
          //   return;
          // }
          wx.showTabBar();
          that.setData({
            is_show:false
          })
          //that.triggerEvent('myevent', 1);
          //this.is_bind_phone();
        }else{
          wx.hideTabBar();
          this.setData({
            is_show:true
          })
        }
      });
    },
    bindGetUserInfo: function (e) {
      const userInfo = e.detail.userInfo;
      const that = this;
      tools.showLoading('登录中');
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
              tools.hideLoading();
              if (res.data.code == 1) {
                const token = res.data.data.token;
                tools.setStorage('token',token);
                // if (tools.globalData.share){
                //   that.setData({is_show:false});
                //   tools.globalData.share = '';
                //   return ;
                // }
                //that.is_bind_phone('1');
                wx.showTabBar();
                that.setData({
                  is_show:false
                });
                that.triggerEvent('myevent', 1);
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
    is_bind_phone(_status){
      const that = this;
      app.wxRequest(
          '/App/User/api', {
            api_name: 'user_info',
            token: tools.getStorage('token')
          },
          (res) => {
            if (res.data.code == 1) {
              wx.showTabBar();
              that.setData({
                is_show:false
              })
              if(!res.data.data.mobile){
                tools.navigateTo('/pages/user/bd_phone/index');
              }else{
               if(_status == 1) that.triggerEvent('myevent', 1);
              }
            } else {
              tools.showToast(res.data.msg);
            }
          }
      );
    }
  }
})
