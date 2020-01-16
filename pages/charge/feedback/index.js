// pages/feedback/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    lispic: [], //图片列表
    lispic_path: [], //图片列表路径
    onOff: 0,
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      const id = options.id;
      const info = {
        device_title:options.device_title,
        device_macno:options.device_macno,
        device_address:options.device_address,
        is_online: options.is_online,
      };
      this.setData({
        id:id || '',
        info: info
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

  },
  /**
   * 上传图片
   */
  choice() {
    let that = this;
    app.uploadFile('', function(flag, idx, msg, data) {
      console.log(flag)
      console.log(msg)
      if (flag == 1) {
        let res = msg.tempFilePaths;
        console.log('length:' + that.data.lispic.length)
        if (that.data.lispic.length < 3) {
          that.setData({
            lispic: that.data.lispic.concat(res)
          });
        } else {
          tools.showModal('最多只能上传8张图片...',()=>{},false);
          return false;
        }

      } else if (flag == 2) {
        tools.hideLoading();
        if (that.data.lispic_path.length < 8) {
          that.data.lispic_path.push(msg.upload_id);
        }
        console.log(that.data.lispic_path);

      }
    }, {
      'api_name': 'img_upload',
      'token':tools.globalData.token
      }, '', 8 - that.data.lispic.length,'/app/agent/api')
  },
  indexpic_delete(e) { //删除图片
    const {lispic, lispic_path} = this.data;
    tools.showModal('是否删除图片？',(flag) => {
      if(flag){
        lispic.splice(e.currentTarget.dataset.index, 1);
        lispic_path.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          lispic,
          lispic_path
        });
      }
    });
  },
  /**
   * 提交
   */
  formSubmit(e) {
    let that = this;
    const {lispic_path, id} = this.data;
    let { onOff } = this.data;
    const content = e.detail.value.content;
    if (tools.isNull(content)) {
      tools.showToast('请填写故障描述');
    } else if (lispic_path.length == 0) {
      tools.showToast('请上传图片');
    } else {
      if (onOff) return;
      this.setData({onOff: 1});
      tools.showLoading('请稍候');
      let data = {
        'api_name': 'device_report',
        'upload_id': lispic_path.join(','),
        'token': tools.globalData.token,
        content,
        id,
      };
      app.wxRequest('/app/agent/api', data, function(res) {
        tools.hideLoading();
        if (res.data.code == 1) {
          tools.showModal('提交成功',(flag) => {
            if(flag){
              tools.navigateBack();
            }
          },false);
        } else {
          that.setData({onOff: 0 });
          tools.showToast(res.data.msg);
        }
      });

    }
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