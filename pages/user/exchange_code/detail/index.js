const app = getApp();
const tools = app.tools;
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo: ''
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
    this.init();
  },
  listeningEvent(e){
    this.onShow();
  },
  init() {
    const that = this;
    tools.showLoading('加载中');
    app.wxRequest('/App/User/api', {
      api_name: 'code_info',
      token: tools.getStorage('token'),
      id: that.options.id
    }, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        let result = res.data.data;
        result.etime = tools.format(result.etime, 'Y-m-d')
        that.setData({
          dataInfo: result,
          content: WxParse.wxParse('content', 'html', result.remark, that, 5)
        })
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
    const that = this;
    const {
      currentTab
    } = this.data;
    wx.showNavigationBarLoading();
    page = 1;
    let data = {
      api_name: 'order_list',
      token: tools.getStorage('token'),
      page,
      pagesize
    };
    if (currentTab == 0) { //售货柜
      data.type = '2';
    } else { //商城
      data.type = '1';
    }
    app.wxRequest('/App/Shop/api', data, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        that.setData({
          list: page == 1 ? result : that.data.list.concat(result),
          lock: result.length < pagesize ? true : false
        })
      } else {
        tools.showToast(res.data.msg);
      }
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page++;
    if (!this.data.lock) {
      this.get_list();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})