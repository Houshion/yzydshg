const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    app.wxRequest(
        '/App/User/api',
        {api_name: 'user_info', token: tools.getStorage('token')},
        (res) => {
          tools.hideLoading();
          if(res.data.code == 1){
            const { data:center_obj } = res.data;
            that.setData({
              center_obj
            });
          }else{
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  is_phone(){
    if(!this.data.center_obj.mobile){
      tools.navigateTo('/pages/user/bd_phone/index');
    }else{
      tools.navigateTo('/pages/user/amend_phone/index?mobile='+this.data.center_obj.mobile);
    }
  },
  listeningEvent(e){
    this.onShow();
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
