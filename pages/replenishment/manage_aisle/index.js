const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      macno:options.macno || ''
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
    this.get_list();
  },
  get_list() { //获取列表
    const that = this;
    const { macno } = this.data;
    tools.showLoading('加载中');
    let data = {
      api_name: 'device_goods_road',
      token:tools.globalData.token,
      macno,
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        const goods_list = result.goods_list;
        const device_info = result.device;
        let loading = goods_list.length > 0 ? true : false;
        that.setData({
          list: goods_list,
          device_info,
          loading
        })
      } else {
        tools.showToast(res.data.msg);
      }

    });
  },
  /**
   * 下架
   */
  updown_goods(e){
    const device_goods_id = e.currentTarget.dataset.device_goods_id;
    const that = this;
    tools.showModal('是否下架该商品?',(flag) => {
      if(flag){
        tools.showLoading('请稍候');
        let data = {
          api_name: 'device_goods_road_set',
          token:tools.globalData.token,
          status:0,
          device_goods_id
        };
        app.wxRequest('/app/staff/api', data,  (res) => {
          tools.hideLoading();
          if (res.data.code == 1) {
            tools.showToast('下架成功');
            that.get_list();
          } else {
            tools.showToast(res.data.msg);
          }
        });
      }
    });
  },
  back(){
    tools.navigateBack();
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