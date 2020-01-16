const app = getApp();
const tools = app.tools;
let page = 1;
let pagesize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    balance: 0,
    recordsList: [

    ]
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
    page = 1;
    this.getMyBalance();
    this.getList()
  },
  listeningEvent(e){
    this.onShow();
  },
  scanSignIn() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
    this.setData({
      show: true
    })
  },

  getPrize() {
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 2000
    })
  },
  close() {
    this.setData({
      status: true,
      show: false
    })
  },
  getMyBalance() {
    const that = this
    app.wxRequest('/App/User/api', {
      api_name: 'my_balance',
      token: tools.getStorage('token')
    }, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        that.setData({
          balance: result,
        })
      } else {
        tools.showToast(res.data.msg);
      }

    });
  },
  getList() {
    const that = this
    let data = {
      api_name: 'record',
      token: tools.getStorage('token'),
      page,
      pagesize
    };
    app.wxRequest('/App/User/api', data, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        result.forEach(item => {
          item.ctime = tools.format(item.ctime, 'Y-m-d H:i')
        });
        that.setData({
          recordsList: page == 1 ? result : that.data.recordsList.concat(result),
          lock: result.length < pagesize ? true : false
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