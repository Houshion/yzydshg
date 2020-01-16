const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargeList: [],
    price: '',
    o_index:0,
    option_id:'',
    onOff:0
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
    const that = this;
    tools.showLoading('加载中');
    console.log(this.data.status)
    let data = {
      api_name: 'recharge_list',
      token: tools.getStorage('token')
    };

    app.wxRequest('/App/User/api', data, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        that.setData({
          chargeList: result,
          option_id:result[0].option_id
        })
      } else {
        tools.showToast(res.data.msg);
      }

    });
  },
  listeningEvent(e){
    this.onShow();
  },
  change(e) {
    const {index,option_id} = e.currentTarget.dataset;
    console.log(option_id);
    this.setData({
      o_index: index,
      option_id,
      price:''
    })
  },

  pay() {
    const that = this;
    const { price,option_id } = this.data;
    if(!option_id && !price){
      tools.showToast('请选择或者填写充值金额');
      return;
    }
    if (!tools.isNum(price) && !option_id) {
      tools.showToast('充值金额输入有误，请重新输入正确数字');
      return;
    }
    tools.showLoading('请稍候');
    let { onOff } = this.data;
    if(onOff)return;
    this.setData({onOff:1});
    tools.showLoading('请稍候');
    let data ={
      api_name: 'recharge',
      token: tools.getStorage('token')
    };
    if(option_id)data.option_id = option_id;
    if(price)data.money = price;
    app.wxRequest(
        '/App/User/api',
        data,
        (res) => {
          if(res.data.code == 1){
            tools.Pay(
                res.data.data,
                success => {
                  tools.hideLoading();
                  tools.showModal('支付成功',() => {
                    tools.navigateBack();
                  },false);
                },
                fail => {
                  that.setData({onOff:0});
                  console.log(fail)
                  tools.hideLoading();
                  if(fail.msg == 'cancel'){
                    tools.showToast('取消支付');
                  }else{
                    tools.showToast('调用支付失败');
                  }
                })
          }else{
            that.setData({onOff:0});
            tools.showToast(res.data.msg);
          }
        }
    );

  },

  price(e) {
    const price =  e.detail.value;
      this.setData({
        price,
        o_index: -1,
        option_id:''
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