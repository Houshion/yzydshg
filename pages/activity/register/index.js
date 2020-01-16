// pages/user/bd_phone/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneValue: '',
    codeValue: '',
    second: '',
    onOff: 0,
    onOff1: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    tools.globalData.share = true;
    const id = this.options.id;
    const leader_id = this.options.leader_id;

    this.setData({
      id: id,
      leader_id: leader_id,
    })
  },
  listeningEvent(e) {
    this.onShow();
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
      app.wxRequest('/Apk/Device/api', {
        api_name: 'send_code',
        phone
      }, res => {
        if (res.data.code == 1) {
          tools.showToast(res.data.msg);
        } else {
          tools.showToast(res.data.msg);
        }
      })
    }
  },
  //绑定手机
  bd_btn: function () {
    let that = this;
    if (this.data.onOff1 == 1) return false;
    const {
      phoneValue: phone,
      codeValue: code,
      id,
      leader_id
    } = this.data;
    if (tools.isNull(phone)) {
      tools.showToast('请输入手机号码');
    } else if (!tools.checkPhone(phone)) {
      tools.showToast('手机号有误');
    } else if (tools.isNull(code)) {
      tools.showToast('请输入短信验证码');
    } else {
      console.log(123)
      that.setData({
        onOff1: 1
      });
      tools.showLoading('请稍候');
      app.wxRequest('/App/User/api', {
        api_name: 'join',
        token: tools.getStorage('token'),
        phone,
        code: code * 1,
        id,
        leader_id
      }, res => {
        tools.hideLoading();
        if (res.data.code == 1) {
          tools.showToast('注册成功');
          setTimeout(() => {
            tools.reLaunch("/pages/user/index/index");
          }, 1500);
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
  //验证码值
  code: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
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