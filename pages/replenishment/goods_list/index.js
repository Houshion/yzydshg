const app = getApp();
const tools = app.tools;
let page = 1;
let pagesize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_list:['全部','缺货货道'],
    currentTab: 0,
    lock: false,
    list:[],
    device_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        macno:options.macno || ''
      })
  },
  // 点击tab切换
  swichNav: function (e) {
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
      page = 1;
      this.get_list();
    }
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
    page = 1;
    this.get_list();
  },
  get_list() { //获取列表
    const that = this;
    const {currentTab, macno} = this.data;
    tools.showLoading('加载中');
    let data = {
      api_name: 'get_device_goods_list',
      token:tools.globalData.token,
      macno,
      page,
      pagesize,
      is_stockout:currentTab
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        const goods_list = result.goods_list;
        const device_info = result.device;
        if(page == 1){
          that.setData({device_info });
        }
        that.setData({
          list: page == 1 ? goods_list : that.data.list.concat(goods_list),
          lock: goods_list.length < pagesize ? true : false
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
    const {currentTab, macno} = this.data;
    wx.showNavigationBarLoading();
    page = 1;
    let data = {
      api_name: 'get_device_goods_list',
      token:tools.globalData.token,
      macno,
      page,
      pagesize,
      is_stockout:currentTab
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        const goods_list = result.goods_list;
        const device_info = result.device;
        that.setData({
          list: page == 1 ? goods_list : that.data.list.concat(goods_list),
          lock: goods_list.length < pagesize ? true : false,
          device_info
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