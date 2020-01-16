// pages/login/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneValue: '',
    pwValue: '',
    next_pwValue: '',
    codeValue: '',
    second: '',
    onOff: 0,
    onOff1: 0,
    eye_status: false,
    next_eye_status: false,
    pw_type: 'password',
    next_pw_type: 'password',
    type: 'replenishment', //replenishment--补货员, charge--负责人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const login_type = tools.globalData.login_type;
    this.setData({
      login_type
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

  },
  /**
   * 获取验证码
   */
  getCode: function () {
    if (this.data.onOff) return false;
    const {
      phoneValue: phone
    } = this.data;
    if (tools.isNull(phone)) {
      tools.showToast('请输入手机号码');
    } else if (!tools.checkPhone(phone)) {
      tools.showToast('手机号有误');
    } else {
      let second = 60;
      const t = setInterval(() => {
        if (second <= 0) {
          second = 0;
          this.setData({
            second: second,
            onOff: 0
          })
          clearInterval(t);
        } else {
          second--;
          this.setData({
            second: second,
            onOff: 1
          })
        }
      }, 1000);
      //获取短信验证码
      app.wxRequest(
        '/Apk/Device/api', {
          api_name: 'send_code',
          phone
        },
        (res) => {
          if (res.data.code == '1') {
            tools.showToast(res.data.msg);
          } else {
            tools.showToast(res.data.msg);
          }
        })


    }
  },
  //登录
  confirm_btn: function () {
    let that = this;
    const {
      phoneValue: phone,
      pwValue: pwd,
      codeValue: code,
      next_pwValue: next_pw
    } = this.data;
    if(this.data.onOff1 == 1) return false;
    if (tools.isNull(phone)) {
      tools.showToast('请输入手机号码');
    } else if (!tools.checkPhone(phone)) {
      tools.showToast('手机号有误');
    } else if (tools.isNull(code)) {
      tools.showToast('请输入验证码');
    } else if (tools.isNull(pwd)) {
      tools.showToast('请输入新登录密码');
    } else if (pwd.length < 6) {
      tools.showToast('登录密码不能少于六位数');
    } else if (tools.isNull(next_pw)) {
      tools.showToast('请再次输入新登录密码');
    } else if (next_pw !== pwd) {
      tools.showToast('两次输入密码不一致');
    } else {
      that.setData({
        onOff1: 1
      });
      app.wxRequest(
        '/Apk/Device/api', {
          api_name: 'update_pwd',
          phone,
          pwd,
          code: code * 1,
          pwd_re: next_pw,
          token: tools.globalData.token
        },
        (res) => {
          tools.hideLoading();
          if (res.data.code == '1') {
            const login_type = tools.globalData.login_type;
            tools.globalData.token = '';
            tools.showModal('修改成功', (flag) => {
              tools.reLaunch('/pages/login/index?type=' + login_type);
            }, false);
          } else {
            that.setData({
              onOff1: 0
            });
            tools.showToast(res.data.msg);
          }
        })
    }
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
  //密码值
  next_pw: function (e) {
    this.setData({
      next_pwValue: e.detail.value
    })
  },
  //验证码值
  code: function (e) {
    this.setData({
      codeValue: e.detail.value
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
  next_eye_click() {
    let {
      next_eye_status
    } = this.data;
    this.setData({
      next_eye_status: !next_eye_status
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