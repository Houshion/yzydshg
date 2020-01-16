// pages/user/center/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        imgUrl: '/img/ic1.png',
        title: '我的钱包',
        url: '/pages/user/moneyPackege/my/index',
        value: '￥0.00'
      },
      {
        imgUrl: '/img/ic1.png',
        title: '我的兑换码',
        url: '/pages/user/exchange_code/index',
        value: '0张'
      },
      {
        imgUrl: '/img/ic1.png',
        title: '我的订单',
        url: '/pages/user/order/index',
        value: ''
      },
      {
        imgUrl: '/img/ic2.png',
        title: '地址管理',
        url: '/pages/user/edit_address/index',
        value: ''
      },
      {
        imgUrl: '/img/ic3.png',
        title: '意见反馈',
        url: '/pages/user/feedback/index',
        value: ''
      }
    ],
    phone: '',
    login_status:false,
    val:false
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
    const that = this;
    tools.isToken((flag) => {
      if(flag){
        that.setData({
          val:true
        })
      }else{
        this.setData({
          val:false
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    tools.showLoading('加载中');
    app.wxRequest(
        '/App/User/api', {
          api_name: 'user_info',
          token: tools.getStorage('token')
        },
        (res) => {
          tools.hideLoading();
          if (res.data.code == 1) {
            const {
              data: center_obj
            } = res.data;
            that.setData({
              center_obj,
              'list[0].value': "￥" + center_obj.balance,
              'list[1].value': center_obj.code_count + "张",
              phone: center_obj.phone
            });
          } else {
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  listeningEvent(e){
    this.onShow();
  },
  call_phone() {
    app.tools.makePhoneCall(this.data.phone);
  },
  //去登录
  login(){
    const that = this;
    tools.isToken((flag) => {
      if(flag){
        that.setData({
          login_status:false,
        })
      }else{
        this.setData({
          login_status:true
        })
      }
    });
  },
  //签到
  signUp() {
    wx.navigateTo({
      url: "/pages/user/signIn/index",
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
