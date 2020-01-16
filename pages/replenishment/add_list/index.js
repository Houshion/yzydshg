const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    list:[],
    device_info:{},
    onOff:0,
    max_num:0,//某种商品的仓库库存
    goods_id:''//某种商品的id
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
      api_name: 'real_peplenish',
      token:tools.globalData.token,
      macno,
      page:1,
      pagesize:999,
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        const result = res.data.data;
        const goods_list = result.goods_list;
        const device_info = result.device;
        if(goods_list.length>0){
            for(let i in goods_list){
              goods_list[i].goods_num =  goods_list[i].inventory;//用于加减运算
              goods_list[i].shop_storage_inventory =  goods_list[i].shop_inventory;//用于暂时运算商家仓库库存
            }
        }
        let loading = goods_list.length > 0 ? true : false;
        that.setData({
          list: goods_list,
          loading,
          device_info
        })
      } else {
        tools.showToast(res.data.msg);
      }

    });
  },
  /**
   * 增加和减少商品
   */
  handle_box(e){
    let { list} = this.data;
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    let { max_inventory,goods_id, shop_inventory, shop_storage_inventory, goods_num} = list[index];
    max_inventory = max_inventory*1;
    shop_inventory = shop_inventory*1;
    shop_storage_inventory = shop_storage_inventory*1;
    goods_num = goods_num*1;
    const storage_inventory = list[index].shop_storage_inventory*1;
    const type =dataset.type;
    list.forEach((item,index) => {
      if( goods_id == item.goods_id){
        if(type == 2){
          if( shop_storage_inventory == item.shop_inventory){
            console.log(1);
            item.shop_storage_inventory = item.shop_inventory -1;
          }else{
            if(item.shop_storage_inventory > 0){
              item.shop_storage_inventory = item.shop_storage_inventory -1;
            }
          }
        }else{
          if( shop_storage_inventory >=  item.shop_inventory){

          }else{
            item.shop_storage_inventory = item.shop_storage_inventory + 1;
          }
        }
      }
    });
    console.log('操作后');
    console.log(list);
    // this.setData({
    //   list
    // });
    if (type == 2 ) {//增加
      goods_num++;
    } else {//减少
      goods_num--;

    }
    if(storage_inventory <=  0){
      if(type == 1){
        list[index].goods_num = goods_num;
        this.setData({list});
        return;
      }else{
        tools.showToast('库存不足');return;
      }
    }
    if(goods_num > max_inventory){
      tools.showToast('货道库存不够');return;
    }

    if (goods_num < 0) {tools.showToast('不能再减少了哦！');return;}

    list[index].goods_num = goods_num;
    this.setData({list});
  },
  /**
   * 完成补货
   */
  confirm_btn(){
    const that = this;
    const { list, macno} = this.data;
    let { onOff } = this.data;
    if(list.length == 0){
      return;
    }
    if(onOff) return;
    this.setData({onOff:1});
    let str = '';
    for(let i in list){
      if(str){
        str += ','+'"'+list[i].device_goods_id+'"' +':'+ list[i].goods_num;
      }else{
        str += '"'+list[i].device_goods_id+'"' +':'+ list[i].goods_num;
      }

    }
    str = "{"+str+"}" ;
    tools.showLoading('加载中');
    let data = {
      api_name: 'real_peplenish',
      token:tools.globalData.token,
      macno,
      data:str
    };
    app.wxRequest('/app/staff/api', data,  (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        tools.showToast('补货完成');
        setTimeout(() => {
          tools.navigateBack();
        },1500);
      } else {
        that.setData({onOff:0});
        tools.showToast(res.data.msg);
      }

    });
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
