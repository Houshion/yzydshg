const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('id'+options.id);
      this.setData({
        type:options.type || '',
        id:options.id || ''
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
    this.get_address();
  },
  listeningEvent(e){
    this.onShow();
  },
  /**
   * 获取地址列表
   */
  get_address(){
    const that = this;
    tools.showLoading('加载中');
    app.wxRequest(
        '/App/User/api',
        {
          api_name: 'address_list',
          token: tools.getStorage('token'),
        },
        (res) => {
          tools.hideLoading();
          if(res.data.code == 1){
            const { data:list} = res.data;
            let loading = list.length > 0 ? true : false;
            that.setData({
              list,
              loading
            });
          }else{
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  radioChange(e) {
    tools.globalData.address_id = e.detail.value;
    tools.navigateBack();
  },
  edit(e){
    const address_id = e.currentTarget.dataset.address_id;
    tools.navigateTo('/pages/user/add_address/index?type=edit&address_id='+address_id);
  },
  clear(e){
    const that = this;
    const { id } = this.data;
    const address_id = e.currentTarget.dataset.address_id;
    const is_default = e.currentTarget.dataset.is_default;
    app.tools.showModal('是否删除？',function (flag) {
      if(flag){
        tools.showLoading('请稍候');
        app.wxRequest(
            '/App/User/api',
            {
              api_name: 'address_del',
              token: tools.getStorage('token'),
              id:address_id
            },
            (res) => {
              tools.hideLoading();
              if(res.data.code == 1){
                if(address_id == id)tools.globalData.address_id='';
                if(is_default == 1 && address_id == id)tools.globalData.confirm_data.address = '';
                tools.showToast('删除成功');
                setTimeout(() => {
                  that.get_address();
                },1500);
              }else{
                tools.showToast(res.data.msg);
              }
            }
        );
      }else{
        console.log('取消');
      }
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
