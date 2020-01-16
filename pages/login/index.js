// pages/login/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    phoneValue: '',
    pwValue: '',
    onOff: 0,
    eye_status: false,
    login_type: '', //replenishment--补货员, charge--负责人, coach -- 教练员, seller -- 销售员
    //教练员账号15263951232，密码:123456
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const login_type = options.type;
    // const login_type = 'charge';
    // const login_type = 'replenishment';
    // const login_type = 'coach';
    // const login_type = 'seller';
    console.log(login_type);
    const title = login_type === 'replenishment' ? '补货员登录' : login_type === 'charge' ? '负责人登录' : login_type === 'seller' ? '销售员登录' : '教练登录';
    console.log(title);
    this.setData({
      login_type
    })
    wx.setNavigationBarTitle({
      title
    });

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const {
      login_type
    } = this.data;
    tools.globalData.no_user = true;
    tools.globalData.routes = this.route + '?type=' + login_type;
   // this.get_userInfo();
  },
  //登录
  login_btn: function () {
    let that = this;
    const {
      phoneValue: phone,
      pwValue: password
    } = this.data;
    let {
      login_type
    } = this.data;
    console.log(login_type)
    if (tools.isNull(phone)) {
      tools.showToast('请输入手机号码');
    }
    // else if (!tools.checkPhone(phone)) {
    //   tools.showToast('手机号有误');
    // }
    else if (tools.isNull(password)) {
      tools.showToast('请输入登录密码');
    } else {
      that.setData({
        onOff: 1
      });
      let type;
      if (login_type == 'replenishment') {
        type = '1'
      } else if (login_type == 'charge') {
        type = '3';
      } else if (login_type == "coach") {
        type = '2';
      } else {
        type = '4'
      }
      tools.showLoading('请稍候');
      app.wxRequest(
        '/Apk/Device/api', {
          api_name: 'login',
          phone,
          password,
          type
        },
        (res) => {
          tools.hideLoading();
          if (res.data.code == '1') {
            //that.save_userInfo();
            tools.globalData.token = res.data.data.token;
            tools.globalData.login_type = login_type;
            tools.showToast('登录成功');
            setTimeout(() => {
              if (login_type == 'replenishment') {
                tools.reLaunch('/pages/replenishment/device_list/index');
              } else {
                tools.reLaunch('/pages/charge/index/index');
              }
            }, 1500);
          } else {
            that.setData({
              onOff: 0
            });
            tools.showToast(res.data.msg);
          }
        })
    }
  },
  /**
   * 保存用户登录信息
   * @param e
   */
  save_userInfo() {
    const {
      login_type,
      phoneValue: phone,
      pwValue: password
    } = this.data;
    tools.globalData.login_type = login_type;
    tools.setStorage('login_type', login_type);
    switch (login_type) {
      case 'replenishment':
        tools.setStorage('replenishment_info', {
          phone,
          password
        });
        break;
      case 'charge':
        tools.setStorage('charge_info', {
          phone,
          password
        });
        break;
      case 'coach':
        tools.setStorage('coach_info', {
          phone,
          password
        });
        break;
    }
  },
  /***
   * 获取用户登录信息
   * @param e
   */
  get_userInfo() {
    let user_info;
    const login_type = tools.getStorage('login_type');
    const {
      login_type: type
    } = this.data;
    if (type == login_type) {
      switch (login_type) {
        case 'replenishment':
          user_info = tools.getStorage('replenishment_info');
          if (user_info) {
            this.setData({
              phoneValue: user_info.phone,
              pwValue: user_info.password
            })
          }
          break;
        case 'charge':
          user_info = tools.getStorage('charge_info');
          if (user_info) {
            this.setData({
              phoneValue: user_info.phone,
              pwValue: user_info.password
            })
          };
          // this.login_btn();
          break;
        case 'coach':
          user_info = tools.getStorage('coach_info');
          if (user_info) {
            this.setData({
              phoneValue: user_info.phone,
              pwValue: user_info.password
            })
          };
          break;
      }
    }
  },
  checkboxChange(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  //手机值
  phone: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  //密码值
  pw: function (e) {
    this.setData({
      pwValue: e.detail.value
    })
  },
  //
  eye_click() {
    let {
      eye_status
    } = this.data;
    this.setData({
      eye_status: !eye_status
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
