const app = getApp();
const tools = app.tools;
const WxParse = require('../../user/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeData: {},
    form: {
      api_name: "",
      token: "",
      meal_id: 1,
      macno: 5201314515461,
      onOff: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scene: decodeURIComponent(options.scene)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  listeningEvent(e) {
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      'form.token': tools.getStorage('token')
    })
    const scene = this.data.scene
    console.log(scene)
    var arr = scene.split("&");
    var meal_id, macno;

    arr.forEach((item, index) => {
      var iarr = item.split("=")
      if (index == 0) {
        meal_id = iarr[1]
      } else {
        macno = iarr[1]
      }
    });
    console.log(meal_id, macno)

    this.setData({
      'form.meal_id': meal_id,
      'form.macno': macno,
      // 'form.meal_id': 9,
      // 'form.macno': " bb20c65c847166ec",
    })
    this.getInit()
  },

  getInit() {
    const that = this
    that.setData({
      'form.api_name': "meal_info",
    });
    tools.showLoading('请稍候');
    app.wxRequest('/App/User/api', this.data.form, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        that.setData({
          activeData: res.data.data,
          content: WxParse.wxParse('content', 'html', res.data.data.rule, that, 5)
        });
      } else {
        tools.showToast(res.data.msg);
      }
    });
  },

  payBtn() {
    const that = this;
    let {
      onOff
    } = this.data;
    if (onOff) return;
    this.setData({
      onOff: 1
    });
    that.setData({
      'form.api_name': "meal_pay",
    });
    tools.showLoading('支付中，请稍候');
    app.wxRequest('/App/User/api', this.data.form, (res) => {
      tools.hideLoading();
      tools.showToast(res.data.msg);
      if (res.data.code == 1) {
        tools.Pay(
          res.data.data,
          success => {
            tools.hideLoading();
            tools.redirectTo("/pages/user/order/index");
          },
          fail => {
            that.setData({
              onOff: 0
            });
            console.log(fail)
            tools.hideLoading();
            if (fail.msg == 'cancel') {
              tools.showToast('取消支付');
            } else {
              tools.showToast('调用支付失败');
            }
          }
        )
      } else {}
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})