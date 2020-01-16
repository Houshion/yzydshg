const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    pay_time: 0,
    onOff:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id || '',
      type: options.type || ''
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
    this.get_detail();
  },
  listeningEvent(e){
    this.onShow();
  },
  get_detail() { //获取详情
    const that = this;
    tools.showLoading('加载中');
    const {
      order_id,
      type
    } = this.data;
    let data = {
      api_name: 'order_info',
      token: tools.getStorage('token'),
      order_id,
      type
    };
    app.wxRequest('/App/Shop/api', data, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        let pay_time;
        if (result.pay_time > 0) {
          pay_time = tools.format(result.pay_time, 'Y-m-d H:i');
        } else {
          pay_time = '无';
        }
        that.setData({
          detail: result,
          pay_time
        })
      } else {
        tools.showToast(res.data.msg);
      }
    });
  },
  /**
   * 微信支付
   */
  pay(){
    const that = this;
    const { order_id } = this.data;
    let { onOff } = this.data;
    if(onOff)return;
    this.setData({onOff:1});
    tools.showLoading('请稍候');
    app.wxRequest(
        '/App/User/api',
        {
          api_name: 'order_pay',
          token: tools.getStorage('token'),
          order_id
        },
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