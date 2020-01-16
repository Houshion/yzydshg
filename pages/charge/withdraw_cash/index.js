const  app = getApp();
const  tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyValue:'',
    sumMoney:0,
    minMoney:0,
    bank_info:'',
    onOff:0,
    rate:0,
    poundage:0,
    book_value:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        sumMoney:options.balance || 0,
        minMoney:options.min_money || 0
      })
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
    // this.get_fee();
    this.info_show();
  },
  /**
   * 获取手续费
   */
  get_fee(){
    const that = this;
    app.wxRequest(
        '/Apk/Device/api',
        {api_name:'commission',token: tools.globalData.token},
        (res) => {
          if (res.data.code == '1') {
              that.setData({
                rate:res.data.data
              })
          } else {
            tools.showToast(res.data.msg);
          }
        })
  },
  /**
   * 获取是否完善资料
   */
  info_show(){
    const that = this;
    tools.showLoading('加载中');
    app.wxRequest(
        '/Apk/Device/api',
        {api_name:'cash_show',token: tools.globalData.token},
        (res) => {
          tools.hideLoading();
          if (res.data.code == '1') {
              that.setData({
                bank_info:res.data.data,
                rate: res.data.data.commission
              })
          } else {
            tools.showToast(res.data.msg);
          }
        })
  },
  /***
   * 提交
   */
  confirm_btn(){
    const that = this;
    let { sumMoney, minMoney, moneyValue} = this.data;
    let {onOff} = this.data;
    sumMoney = sumMoney*1;
    minMoney = minMoney*1;
    if(tools.isNull(moneyValue)){
      tools.showToast('请输入提现金额');
    }else if(moneyValue < minMoney){
      tools.showToast('最低提现金额: ￥'+minMoney);
    }else if(moneyValue >= sumMoney){
      tools.showToast('提现金额大于可提现金额');
    }else{
      if (onOff) return;
      this.setData({onOff: 1});
      tools.showLoading('请稍候');
      let send_data = {
        api_name: 'cash_submit',
        token: tools.globalData.token,
        total_money:moneyValue
      };
      app.wxRequest(
          '/Apk/Device/api',
          send_data,
          (res) => {
            tools.hideLoading();
            if (res.data.code == '1') {
              tools.showToast('提交成功');
              setTimeout(() => {
                tools.navigateBack();
              }, 1500);
            } else {
              that.setData({onOff: 0});
              tools.showToast(res.data.msg);
            }
          })
    }
  },
  /***
   * 全部提现
   */
  all_btn(){
    const { sumMoney } = this.data;
    this.setData({
      moneyValue:sumMoney
    })
  },
  /**
   * input的值
   */
  money_input(e){
    let  moneyValue = e.detail.value;
    let  {  rate } = this.data;
    let poundage = moneyValue*(rate/100);
    const count = this.count(poundage);
    console.log(poundage);
    console.log(count);
    let book_value;
    if(poundage < 0.01){
      poundage = 0;
    }else{
      console.log(count);
      if( count > 2){
        poundage = Number(poundage).toFixed(2);
      }
    }

    book_value = Number(moneyValue -1 - poundage).toFixed(2);
    this.setData({
      moneyValue,
      poundage,
      book_value
    })
  },
  count(value){
    let index = String(value).indexOf(".") + 1;//获取小数点的位置
    const count = String(value).length - index;//获取小数点后的个数
    return count;
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
