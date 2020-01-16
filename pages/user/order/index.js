const app = getApp();
const tools = app.tools;
let page = 1;
let pagesize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    tab_list: ['售货柜', '商城', '套餐'],
    lock: false,
    list: [],
    is_show: false,
    reasonValue: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
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
    page = 1;
    this.get_list();

  },
  listeningEvent(e){
    this.onShow();
  },
  // 点击tab切换
  swichNav: function (e) {
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  //页面滑动
  bindChange: function (e) {
    console.log(e);
    let that = this;
    that.setData({
      currentTab: e.detail.current
    });
    page = 1;
    this.get_list();
  },
  get_list() { //获取列表
    const that = this;
    const {
      currentTab
    } = this.data;
    tools.showLoading('加载中');
    let data = {
      api_name: 'order_list',
      token: tools.getStorage('token'),
      page,
      pagesize
    };
    if (currentTab == 0) { //售货柜
      data.type = '2';
    } else if (currentTab == 1) { //商城
      data.type = '1';
    } else { //套餐
      data.type = '3';
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

    });
  },
  /**
   * 显示申请退款
   */
  cash_btn(e) {
    const order_id = e.currentTarget.dataset.order_id;
    const {
      is_show
    } = this.data;
    this.setData({
      is_show: !is_show,
      order_id
    });
  },
  /**
   * 关闭申请退款弹窗
   */
  close_click() {
    const {
      is_show
    } = this.data;
    this.setData({
      is_show: !is_show
    });
  },
  /**
   * 去申请退款
   */
  to_apply() {
    const {
      reasonValue,
      is_show,
      order_id
    } = this.data;
    const that = this;
    if (tools.isNull(reasonValue)) {
      tools.showToast('请输入退款理由...');
    } else {
      tools.showLoading('请稍候');
      let data = {
        api_name: 'drawback',
        token: tools.getStorage('token'),
        order_id,
        reason: reasonValue
      };
      app.wxRequest('/App/Shop/api', data, (res) => {
        tools.hideLoading();
        if (res.data.code == 1) {
          tools.showToast('提交成功');
          page = 1;
          that.get_list();
          that.setData({
            is_show: !is_show
          });
        } else {
          tools.showToast(res.data.msg);
        }
      });
    }
  },
  /**
   * 退款理由输入框
   */
  reason(e) {
    this.setData({
      reasonValue: e.detail.value
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
    } else if (currentTab == 1) { //商城
      data.type = '1';
    } else { //套餐
      data.type = '3';
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