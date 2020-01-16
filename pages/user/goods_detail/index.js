const  app = getApp();
const tools = app.tools;
const WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sum_list:[],//存本地的数据
    list_obj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        tab_id:options.tab_id || '',
        list_id:options.id || '',
        goods_num:options.goods_num*1 || '',
        inventory:options.inventory*1 || ''
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
    const that = this;
    this.goods_detail().then((res)=>{
      //取本地购物车数据
      const sum_list = wx.getStorageSync('list');
      that.setData({
        sum_list:sum_list?sum_list:[]
      });
    })
  },
  listeningEvent(e){
    this.onShow();
  },
  /**
   * 获取商品详情
   */
  goods_detail(){
    const that = this;
    const { list_id } = this.data;
    return new Promise((resolve,reject)=>{
      tools.showLoading('加载中');
      app.wxRequest(
          '/App/Shop/api',
          {
            api_name: 'goods_detail',
            token: tools.getStorage('token'),
            id: list_id
          },
          (res) => {
            tools.hideLoading();
            console.log(res);
            if(res.data.code == 1){
              const { data:list_obj} = res.data;
              that.setData({
                list_obj,
                content: WxParse.wxParse('content', 'html', list_obj.details, that, 5)
              });
              resolve();
            }else{
              tools.showToast(res.data.msg);
            }
          }
      );
    });
  },
  /***
   * 加入购物车
   */
  add_cart(){
    const {tab_id, list_id, inventory} = this.data;
    let { sum_list, goods_num} = this.data;
    let list_item = {}, sum_item = {};
    let list = [];
    goods_num++;
    if(goods_num>inventory){tools.showToast('库存不足');return;}
    if(sum_list.length > 0){
      let sum_inarray = 0;
      sum_list.some( (itemName, idx) => {
        if( itemName.id ==  tab_id){
          let inarray = 0;
          itemName.list.some( (item, index) => {
            if(item.id == list_id){
              inarray = 1;
              item.goods_num = goods_num;
              return true;
            }else{
              list_item.id = list_id;
              list_item.goods_num = goods_num;
            }
          });
          if(inarray == 0) itemName.list.push(list_item);
          sum_inarray=1;
          return true;
        }else{
          list_item.id = list_id;
          list_item.goods_num = goods_num;
        }
      });
      if(sum_inarray == 0){
        list = [];
        list.push(list_item);
        sum_item.list = list;
        sum_item.id = tab_id;
        sum_list.push(sum_item);
      }
    }else{
      list = [];
      list_item.id = list_id;
      list_item.goods_num = goods_num;
      list.push(list_item);
      sum_item.list = list;
      sum_item.id = tab_id;
      console.log(sum_list)
      sum_list.push(sum_item);
    }
    this.setData({
      goods_num
    });
    wx.setStorageSync('list',sum_list);
    tools.showToast('加入购物车成功');
    setTimeout(() => {
      tools.navigateBack();
    },2000)
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