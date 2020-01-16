// pages/replenishment/device_list/index.js
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
    tab_list: ['全部', '离线设备', '缺货设备', '未激活'],
    lock: false,
    list:[],
    searchValue:''
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
  /**
   * 搜索输入的值
   */
  search_click(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  searchBtn(){
    page = 1;
    this.get_list();
  },
  /**
   * 补货
   * @param e
   * @returns {boolean}
   */
  add_list(e){
    const macno = e.currentTarget.dataset.macno;
    tools.navigateTo('/pages/replenishment/goods_list/index?macno='+macno);
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
    const that = this;
    that.setData({ currentTab: e.detail.current });
    page = 1;
    this.get_list();
  },
  get_list() { //获取列表
    const that = this;
    const {currentTab, searchValue} = this.data;
    tools.showLoading('加载中');
    let data = {
      api_name: 'device_list',
      token:tools.globalData.token,
      page,
      pagesize,
      status:currentTab
    };
    if(!tools.isNull(searchValue)){
      data.search_title = searchValue;
    }
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data.device_list;
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
   * 退出登录
   */
  log_out(){
    tools.showModal('是否退出登录?',(flag)=>{
      if(flag){
        const login_type = tools.globalData.login_type;
        tools.globalData.token = '';
        tools.reLaunch('/pages/login/index?type='+login_type);
      }
    });
  },
  /**
   * 激活设备
   */
  active_click(e){
    const macno = e.currentTarget.dataset.macno;
    wx.scanCode({
      success(res) {
        tools.hideLoading();
        console.log(res)
        const current_macno = tools.getUrlParam('macno','',res.result);

        console.log(current_macno)
        console.log(macno)
        if(macno!= current_macno && current_macno){
          tools.showToast('设备号不一致');
          return ;
        }
        if(res.result.indexOf('macno') != -1 && current_macno){
          tools.navigateTo('../act_device/index?macno='+macno);
        }else{
          tools.showToast('二维码无效');
          return ;
        }
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
    const that = this;
    const {currentTab, searchValue} = this.data;
    wx.showNavigationBarLoading();
    page = 1;
    let data = {
      api_name: 'device_list',
      token:tools.globalData.token,
      page,
      pagesize,
      status:currentTab
    };
    if(!tools.isNull(searchValue)){
      data.search_title = searchValue;
    }
    app.wxRequest('/app/staff/api', data,  (res) => {;
      if (res.data.code == 1) {
        const result = res.data.data.device_list;
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