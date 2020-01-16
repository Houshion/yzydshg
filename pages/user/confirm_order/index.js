// pages/user/confirm_order/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    address_id:'',
    onOff:0,
    pay_type:'wallet',
    money:0
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
    this.get_info();
    const confirm_data = tools.globalData.confirm_data;
    const address = tools.globalData.confirm_data.address;
    let { address_id } = this.data;
    // if(address==''){}else{address_id = address.id;}
    if(tools.globalData.address_id){
      address_id = tools.globalData.address_id;
      this.get_address(address_id);
    }else{
      if(address==''){
        address_id='';
      }else{address_id = address.id;}
    }
    this.setData({
      confirm_data,
      address,
      address_id
    })
  },
  listeningEvent(e){
    this.onShow();
  },
  edit_addr(){
    const { address_id } = this.data;
    tools.navigateTo('/pages/user/edit_address/index?type=edit&id='+address_id);
  },
  /***
   * 获取地址
   */
  get_address(id){
    const that = this;
    tools.showLoading('请稍候');
    app.wxRequest(
        '/App/Shop/api',
        {
          api_name: 'get_address',
          token: tools.getStorage('token'),
          id
        },
        (res) => {
          tools.hideLoading();
          if(res.data.code == 1){
            that.setData({
              address:res.data.data
            })
          }else{
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  /**
   * 去支付
   */
  pay_btn(){
    const that = this;
    const { pay_type,address_id } = this.data;
    let { onOff } = this.data;
    if(!address_id){
      tools.showToast('请添加地址');return;
    }
    if(onOff)return;
    this.setData({onOff:1});
    const goods_data = JSON.stringify(tools.globalData.cart_data);
    tools.showLoading('请稍候');
    app.wxRequest(
        '/App/Shop/api',
        {
          api_name: 'pay',
          token: tools.getStorage('token'),
          address_id,
          pay_type:pay_type == 'wallet' ? '1' : '2',
          goods_data
        },
        (res) => {
          if(res.data.code == 1){
            if(pay_type == 'wallet'){//余额支付
              tools.hideLoading();
              wx.removeStorageSync('list');//清除购物车商品
              tools.showModal('支付成功',() => {
                tools.navigateBack();
              },false);
            }else{//微信支付
              tools.Pay(
                  res.data.data,
                  success => {
                    tools.hideLoading();
                    wx.removeStorageSync('list');//清除购物车商品
                    tools.showModal('支付成功',() => {
                      tools.navigateBack();
                    },false);
                  },
                  fail => {
                    that.setData({onOff:0});
                    console.log(fail)
                    tools.hideLoading();
                    wx.removeStorageSync('list');//清除购物车商品
                    if(fail.msg == 'cancel'){
                      tools.showToast('取消支付');
                      tools.redirectTo('/pages/user/order/index');
                    }else{
                      tools.showToast('调用支付失败');
                    }
                  })
            }
          }else{
            that.setData({onOff:0});
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  /**
   * 获取余额
   */
  get_info(){
    const that = this;
    app.wxRequest(
        '/App/User/api', {
          api_name: 'user_info',
          token: tools.getStorage('token')
        },
        (res) => {
          if (res.data.code == 1) {
            that.setData({
              money:res.data.data.balance
            });
          } else {
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  radioChange(e){
    this.setData({
      pay_type:e.detail.value
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
