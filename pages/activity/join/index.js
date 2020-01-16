const app = getApp();
const tools = app.tools;
const WxParse = require('../../user/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeData: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getInit(options.id)
    // this.getInit(3)
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

    this.getInit(this.options.id)
  },
  listeningEvent(e){
    this.onShow();
  },

  getInit(id) {
    const that = this
    tools.showLoading('请稍候');
    app.wxRequest('/App/User/api', {
      api_name: "join_Activity",
      // token: "123_user",
      token: tools.getStorage('token'),
      id: id
    }, (res) => {
      tools.hideLoading();
      if (res.data.code == 1) {
        let joiner = new Array()
        let result = res.data.data
        for (var i = 0; i < result.need_arr.length; i++) {
          var obj = {};
          obj.num = result.need_arr[i];
          obj.img = '';
          for (var j = 0; j < result.user.length; j++) {
            if (i == j) {
              obj.img = result.user[j];
            }
          }
          joiner.push(obj);
        }
        result.joiner = joiner
        console.log(JSON.stringify(joiner));

        setInterval(() => {
          result.etime--;
          that.setData({
            activeData: result,
          });
        }, 1000);

        that.setData({
          activeData: result,
          content: WxParse.wxParse('content', 'html', res.data.data.remark, that, 5)
        });
      } else {
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
  onShareAppMessage: function (res) {
    const {
      id,
      leader_id,
    } = this.data.activeData;
    if (res.from === 'button') {

    }
    return {
      title: '邀请学员',
      path: '/pages/activity/register/index?id=' + id + '&leader_id=' + leader_id,
      success: (res) => {
        tools.showToast('转发成功');
        console.log('成功', res)
      },
      fail: (err) => {
        tools.showToast('转发失败');
      }
    }
  }
})