 const app = getApp();
 const tools = app.tools;
 const WxParse = require('../wxParse/wxParse.js');
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     detail: {},
     pay_time: 0,
     formData: {
       api_name: 'goods_info_phone',
       token: '',
     },
     onOff: 0,

   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     this.setData({
       scene: decodeURIComponent(options.scene)
     })
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
     const scene = this.data.scene
     console.log(scene, scene.split("=")[0], scene.split("=")[1])
     this.setData({
       //  'formData.order_id': "645",
       'formData.order_id': scene.split("=")[1],
       'formData.token': tools.getStorage('token')
     });
     this.get_detail();
   },
   listeningEvent(e) {
     this.onShow();
   },
   //获取详情
   get_detail() {
     const that = this;
     tools.showLoading('加载中');
     app.wxRequest('/App/User/api', this.data.formData, (res) => {
       tools.hideLoading();
       if (res.data.code == 1) {
         const result = res.data.data;
         that.setData({
           detail: result,
           content: WxParse.wxParse('content', 'html', result.goods_info.details, that, 5)
         })
       } else {
         tools.showToast(res.data.msg);
       }
     });
   },
   // 支付
   payNow() {
     const that = this;
     let {
       onOff
     } = this.data;
     if (onOff) return;
     this.setData({
       onOff: 1
     });
     that.setData({
       'formData.api_name': "goods_pay_phone",
     })
     //  tools.showToast("支付成功", "success")
     tools.showLoading('加载中');
     app.wxRequest('/App/User/api', this.data.formData, (res) => {
       tools.hideLoading();
       console.log(res)
       //支付动作
       if (res.data.code == 1) {
         tools.Pay(
           res.data.data,
           success => {
             tools.hideLoading();
             tools.showModal('支付成功', () => {
               tools.reLaunch("/pages/user/index/index")
             }, false);
           },
           fail => {
             that.setData({
               onOff: 0
             });
             console.log(fail)
             tools.hideLoading();
             if (fail.msg == 'cancel') {
               tools.showToast('取消支付');
             } else {
               tools.showToast('调用支付失败');
             }
           })
       } else {
         that.setData({
           onOff: 0
         });
         tools.showToast(res.data.msg);
       }
     });
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