const app = getApp();
const tools = app.tools;
let page = 1;
let pagesize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student_num:'',
    coach_code:'',
    lock: false,
    list:[],
    is_show: false,
    shareImg: ''
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
  init(code){
    const that = this;
    const login_type = tools.globalData.login_type;
    let type = login_type == 'charge' ? '1' : '2';
    tools.showLoading('加载中');
    const data = {
      api_name: 'register_coach_invite',
      type,
      code
    };
    app.wxRequest('/apk/device/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        this.setData({
          shareImg: result
        })
      } else {
        tools.showToast(res.data.msg);
      }

    });
  },
  codeShow(){
    const { is_show } = this.data;
    this.setData({
      is_show: ! is_show
    })
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
    const login_type = tools.globalData.login_type;
    tools.showLoading('加载中');
    let data = {
      api_name: 'my_students',
      token:tools.globalData.token,
      page,
      pagesize
    };
    app.wxRequest('/app/coach/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        if(page==1){
          this.init(result.coach_code);
          that.setData({
            coach_code:result.coach_code,
            student_num:result.student_num
          })
        }
        that.setData({
          list: page == 1 ? result.student_list : that.data.list.concat(result.student_list),
          lock: result.student_list.length < pagesize ? true : false,
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
    wx.showNavigationBarLoading();
    page = 1;
    const that = this;
    const login_type = tools.globalData.login_type;
    tools.showLoading('加载中');
    let data = {
      api_name: 'my_students',
      token:tools.globalData.token,
      page,
      pagesize
    };
    app.wxRequest('/app/coach/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        that.setData({
          list: page == 1 ? result.student_list : that.data.list.concat(result.student_list),
          lock: result.student_list.length < pagesize ? true : false,
          coach_code:result.coach_code,
          student_num:result.student_num
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
