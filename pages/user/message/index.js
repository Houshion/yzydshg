// pages/user/message/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: { //current_status当前物流状态，complete_status是否已签收
    message: {}
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
    this.getInit();
  },
  listeningEvent(e){
    this.onShow();
  },
  getInit() {
    const that = this;
    tools.showLoading('请稍候');
    app.wxRequest('/App/Shop/api', {
      api_name: 'look_over',
      id: that.options.id,
      token: tools.getStorage('token'),
    }, res => {
      tools.hideLoading();
      if (res.data.code == '1') {
        that.setData({
          message: res.data.data
        })
      } else {
        tools.showToast(res.data.msg);
      }
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