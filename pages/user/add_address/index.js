const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[],
    checked:true,
    list:[],
    name:'',
    mobile:'',
    detailaddress: '',
    onOff:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        type:options.type || '',
        address_id:options.address_id || ''
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
    const {type} = this.data;
    if(type=='edit'){
      this.address_edit();
    }
  },
  listeningEvent(e){
    this.onShow();
  },
  /**
   * 获取编辑的地址
   * @param e
   */
  address_edit(){
    const that = this;
    const {address_id} = this.data;
    tools.showLoading('请稍候');
    app.wxRequest(
        '/App/User/api', {api_name:'address_edit',token:tools.getStorage('token'),id:address_id,type:1},
        (res) => {
          tools.hideLoading();
          if(res.data.code == 1){
            const {name, mobile, province, city, area, detailaddress, is_default} = res.data.data;
              that.setData({
                name,
                mobile,
                detailaddress,
                region:[province,city,area],
                checked:is_default*1?true:false
              })
          }else{
            tools.showToast(res.data.msg);
          }
        }
    );
  },
  bindRegionChange(e) {
    let region  = e.detail.value;
    this.setData({ region });
  },
  formSubmit(e) {
    let { region, type, address_id} = this.data;
    let { user_name, phone, city, address, defalut_address} = e.detail.value;
    if(type == 'edit' && city.length==0){
        city = region;
    }
    if(tools.isNull(user_name)){
      tools.showToast('请输入收货人姓名');
    }else if(tools.isNull(phone)){
      tools.showToast('请输入手机号码');
    }else if(!tools.checkPhone(phone)){
      tools.showToast('手机号码有误');
    }else if(city.length == 0){
        tools.showToast('请选择所在地区');
    }else if(tools.isNull(address)){
      tools.showToast('请输入收货人详细地址');
    }else{
      let data = {
        province:city[0],
        city:city[1],
        area:city[2],
        name:user_name,
        mobile:phone,
        detailaddress:address,
        token:tools.getStorage('token'),
        is_default:defalut_address?1:0
      };
      if(type=='edit'){//修改地址
        data.api_name='address_edit';
        data.id = address_id;
        data.type='2';
      }else{//添加地址
        data.api_name='add_address';
      }
      this.add_address(data);
    }
  },
  /**
   * 添加地址和修改地址
   */
  add_address(data){
    const that = this;
    let { onOff } = this.data;
    if (onOff) return;
    this.setData({onOff: 1});
    tools.showLoading('请稍候');
    app.wxRequest(
        '/App/User/api', data,
        (res) => {
          tools.hideLoading();
          if(res.data.code == 1){
            tools.showModal('保存成功',(flag) => {
              tools.navigateBack();
            },false );
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
