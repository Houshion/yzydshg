const app = getApp();
const tools = app.tools;
const WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false,
    show: false,
    signPageData: {},
    signDate: [],
    mission: [],
    signFrom: {
      api_name: "sign_action",
    },
    signSuccess: {},
    getPrizeStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(this.data.status)
    this.setData({
      'signFrom.token': tools.getStorage('token')
    })
    this.getInit();
  },
  listeningEvent(e) {
    this.onShow();
  },
  getInit() {
    const that = this;
    app.wxRequest('/App/User/api', {
      api_name: 'sign_index',
      token: tools.getStorage('token'),
    }, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        let signDate = new Array();
        let user_sign = result.user_sign;
        let state;
        for (const key in result.week) {
          if (result.week.hasOwnProperty(key)) {
            state = user_sign ? user_sign.indexOf(key) : -1
            signDate.push({
              date: result.week[key],
              name: tools.getWeekStr(key),
              status: state > -1 ? true : false
            })
          }
        }

        that.setData({
          signPageData: result,
          signDate: signDate,
          status: result.check_sign == 0 ? false : true,
          content: WxParse.wxParse('content', 'html', result.sign_rule, that, 5)
        })
      } else {
        tools.showToast(res.data.msg);
      }
    });
  },

  scanSignIn() {
    const that = this;
    wx.scanCode({
      success(res) {
        that.setData({
          "signFrom.is_sign": tools.getUrlParam("is_sign", '', res.result),
          "signFrom.timestamp": tools.getUrlParam("timestamp", '', res.result),
          "signFrom.macno": tools.getUrlParam("macno", '', res.result),
        })
        that.goSign()
      }
    })
  },

  goSign() {
    const that = this;
    console.log(that.data.signFrom)
    app.wxRequest('/App/User/api', that.data.signFrom, (res) => {
      console.log(res);
      tools.hideLoading();
      tools.showToast(res.data.msg);
      if (res.data.code == 1) {
        that.setData({
          show: true,
          signSuccess: res.data.data
        })
        this.getInit();
      }
    });
  },

  getPrize(e) {
    if (this.data.getPrizeStatus) {
      console.log("status:-------->" + this.data.getPrizeStatus)
      this.setData({
        getPrizeStatus: false
      })
      const that = this;
      let id = e.target.dataset.id;
      app.wxRequest('/App/User/api', {
        api_name: 'receive',
        token: tools.getStorage('token'),
        id: id
      }, (res) => {
        tools.hideLoading();
        tools.showToast(res.data.msg);
        setTimeout(() => {
          that.getInit()
          that.setData({
            getPrizeStatus: true
          })
        }, 1500);
      });
    }
  },
  close() {
    this.setData({
      status: true,
      show: false
    })
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