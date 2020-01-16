const app = getApp();
const tools = app.tools;
const WxParse = require('../wxParse/wxParse.js');
// pages/user/agreement/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {},

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
    const that = this
    tools.showLoading('请稍候');
    app.wxRequest('/App/User/api', {
      api_name: "user_agreement",
      token: tools.getStorage('token'),
    }, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        that.setData({
          // content: res.data.data
          content: WxParse.wxParse('content', 'html', res.data.data, that, 5)
        });
      } else {
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