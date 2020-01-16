// pages/replenishment/act_device/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    onOff:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      macno:options.macno || ''
    })
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
    const that = this;
    const { macno } = this.data;
    tools.showLoading('加载中');
    let data = {
      api_name: 'device_activate',
      token:tools.globalData.token,
      status:0,
      macno
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        that.setData({
          info:res.data.data
        })
      } else {
        tools.showToast(res.data.msg);
      }
    });
  },
  /***
   * 激活设备
   */
  active_click(){
    const that = this;
    const { macno } = this.data;
    let {onOff } = this.data;
    if(onOff) return;
    this.setData({onOff:1});
    tools.showLoading('请稍候');
    let data = {
      api_name: 'device_activate',
      token:tools.globalData.token,
      status:1,
      macno
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
       tools.redirectTo('../success/index');
      } else {
        that.setData({onOff:0});
        tools.showToast(res.data.msg);
      }
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