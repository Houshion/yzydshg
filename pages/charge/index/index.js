// pages/charge/index/index.js
const app = getApp();
const tools = app.tools;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        url: '/pages/charge/record/index',
        img_url: '/img/charge_ic1.png',
        title: '提现记录'
      },
      {
        url: '/pages/charge/detail/index',
        img_url: '/img/charge_ic2.png',
        title: '收入明细'
      },
      {
        url: '/pages/charge/device_list/index',
        img_url: '/img/charge_ic3.png',
        title: '设备列表'
      },
      {
        url: '/pages/charge/amend_password/index',
        img_url: '/img/charge_ic4.png',
        title: '修改密码'
      }
    ],
    coach_list: [{
        url: '/pages/charge/record/index',
        img_url: '/img/charge_ic1.png',
        title: '提现记录'
      },
      {
        url: '/pages/charge/detail/index',
        img_url: '/img/charge_ic2.png',
        title: '收入明细'
      },
      {
        url: '/pages/charge/student/index',
        img_url: '/img/charge_ic5.png',
        title: '我的学员',
        status: 1
      },
      {
        url: '/pages/charge/share/index',
        img_url: '/img/charge_ic6.png',
        title: '邀请学员',
        status: 2
      },
      {
        url: '/pages/charge/amend_password/index',
        img_url: '/img/charge_ic4.png',
        title: '修改密码'
      }
    ],
    sellerList: [{
        url: '/pages/charge/royalty/index',
        img_url: '/img/charge_ic1.png',
        title: '每月提成'
      },
      {
        url: '/pages/charge/device_list/index?seller=true',
        img_url: '/img/charge_ic3.png',
        title: '设备列表',
        num: ''
      },
      {
        url: '/pages/charge/gym_list/index',
        img_url: '/img/seller_ic1.png',
        title: '健身房列表',
        num: ''
      },
      {
        url: '/pages/charge/amend_password/index',
        img_url: '/img/charge_ic4.png',
        title: '修改密码'
      }
    ],
    userInfo: '',
    student_num: '',
    coach_code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /***
   * 获取学员数量
   */
  student_num() {
    const that = this;
    let data = {
      api_name: 'student_num',
      token: tools.globalData.token,
    };
    app.wxRequest('/app/coach/api', data, (res) => {
      if (res.data.code == 1) {
        that.setData({
          student_num: res.data.data.student_num
        })
      } else {
        tools.showToast(res.data.msg);
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const login_type = tools.globalData.login_type;
    console.log(login_type)
    this.setData({
      login_type
    });
    this.get_data();
    if (login_type == 'coach') {
      this.student_num();
    }
  },
  /**
   * 获取首页信息
   */
  get_data() {
    const that = this;
    tools.showLoading('请稍候');
    const {
      login_type
    } = this.data;
    let _url;
    if (login_type == 'charge') {
      _url = '/app/agent/api';
    } else if (login_type == 'coach') {
      _url = '/app/coach/api'
    } else {
      _url = '/app/sale/api'
    }
    app.wxRequest(
      _url, {
        api_name: 'index',
        token: tools.globalData.token
      },
      (res) => {
        tools.hideLoading();
        if (res.data.code == '1') {
          if (login_type == 'coach' || login_type == 'charge') {
            that.setData({
              coach_code: res.data.data.coach_code
            })
          }
          that.setData({
            userInfo: res.data.data
          })
          if (login_type == 'seller') {
            console.log(that.data.sellerList)
            that.setData({
              'sellerList[1].num': res.data.data.device_num,
              'sellerList[2].num': res.data.data.agent_num,
            })
            console.log(that.data.sellerList)
          }
        } else {
          tools.showToast(res.data.msg);
        }
      })
  },
  problem() {
    tools.showModal('用户提现金额,但未得到通过,则进入冻结资金库', () => {}, false);
  },
  /**
   * 退出登录
   */
  log_out() {
    tools.showModal('是否退出登录?', (flag) => {
      if (flag) {
        const login_type = tools.globalData.login_type;
        tools.globalData.token = '';
        tools.reLaunch('/pages/login/index?type=' + login_type);
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
  onShareAppMessage: function(res) {
    const {
      coach_code,
      login_type
    } = this.data;
    if (res.from === 'button') {

    }
    if (login_type == 'coach' || login_type == 'charge' ){
      return {
        title: '邀请学员',
        path: '/pages/charge/share/index?code=' + coach_code+ '&type='+ (login_type  == 'coach' ? '2' : '1'),
        imageUrl: tools.globalData.url+'/H5/miniprogram/img/share_bg.png',
        success: (res) => {
          tools.showToast('转发成功');
          console.log('成功', res)
        },
        fail: (err) => {
          tools.showToast('转发失败');
        }
      }
    }
  }
})
