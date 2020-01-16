const tools = new class {

  constructor() {

    this.globalData = {
      url: 'https://www.youhejiankang.com',
      // url: 'https://yzjsshg.https.xiaozhuschool.com',
      no_user:false
    };

  }

  //存本地数据
  getStorage(name) {
    return wx.getStorageSync(name);
  }
  //取本地数据
  setStorage(name, value) {
    return wx.setStorageSync(name, value);
  }
  //清除某个本地数据
  removeStorage(name) {
    wx.removeStorageSync(name);
  }

  //判断登录状态
  isToken(callback) {
    const value = wx.getStorageSync('token');
    if (value) {
      callback(1);
    } else {
      callback(0);
    }
  }

  // 显示消息提示框
  showToast(title, icon = 'none', duration = 1200) {
    wx.showToast({
      title,
      icon,
      duration
    })
  }

  //隐藏消息提示框
  hideToast() {
    wx.hideToast();
  }

  //显示 loading 提示框
  showLoading(title, mask = false) {
    wx.showLoading({
      title,
      mask
    })
  }


  //隐藏 loading 提示框
  hideLoading() {
    wx.hideLoading();
  }

  //显示模态对话框
  showModal(content, callback, showCancel = true, title = '提示') {
    wx.showModal({
      title,
      content,
      showCancel,
      success(res) {
        if (res.confirm) {
          callback(1);
        } else if (res.cancel) {
          callback(0)
        }
      }
    })
  }

  //拨打电话
  makePhoneCall(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber // 仅为示例，并非真实的电话号码
    })
  }

  //发起微信支付
  Pay(data, callback1, callback2) {
    const {
      timeStamp,
      nonceStr,
      package: packAge,
      paySign,
      signType
    } = data;
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: packAge,
      signType,
      paySign,
      success(success) {
        if (success.errMsg == 'requestPayment:ok') {
          callback1({
            msg: 'success',
            success
          });
        }
      },
      fail(err) {
        if (err.errMsg == 'requestPayment:fail cancel') { //用户取消支付
          callback2({
            msg: 'cancel',
            err
          });
        } else { //调用支付失败
          callback2({
            msg: 'fail',
            err
          });
        }

      }
    })
  }

  //保留当前页面，跳转到应用内的某个页面
  navigateTo(url) {
    wx.navigateTo({
      url
    });
  }

  //关闭当前页面，跳转到应用内的某个页面
  redirectTo(url) {
    wx.redirectTo({
      url
    });
  }

  //关闭所有页面，打开到应用内的某个页面
  reLaunch(url) {
    wx.reLaunch({
      url
    });
  }

  //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  switchTab(url) {
    wx.switchTab({
      url
    });
  }

  //关闭当前页面，返回上一页面或多级页面
  navigateBack(delta = 1) {
    wx.navigateBack({
      delta
    });
  }

  //获取网络类型
  getNetworkType(callback) {
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        callback(networkType);
      }
    })
  }

  //监听网络状态变化事件
  /*
    networkType 	网络类型
    wifi,2g,3g,4g,unknown,none
    isConnected 当前是否有网络连接
   */
  onNetworkStatusChange(callback) {
    wx.onNetworkStatusChange(function (res) {
      callback({
        isConnected,
        networkType
      })
    })
  }

  //去除左右空格
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  /*判断是否为空*/
  isNull(val) {
    return this.trim(val).length == 0 ? true : false;
  }

  /*秒转换成时间*/
  formatTime(second) {
    return [parseInt(second / 60 / 60) + '时', parseInt(second / 60 / 60) + '分', second % 60 + '分'].join(",").replace(/,/g, '');
  }

  /*日期格式化*/
  format(time, ff) {
    if (time.length == 10) time = time * 1000;
    let d = new Date(time);
    return this.formatDate(d, ff);
  }

  formatDate(now, ff) {
    let year = now.getFullYear();
    let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    let second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    if (ff == 'Y-m-d') {
      return year + "-" + month + "-" + date;
    } else if (ff == 'Y-m-d H:i:s') {
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    } else if (ff == 'Y-m-d H:i') {
      return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    }
  }

  /*判断身份证格式是否正确*/
  checkIdCode(_value) {
    let value = this.trim(_value);
    let userCardreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let taiwanreg = /^[A-Z][0-9]{9}$/; //台湾
    let xianggangreg = /^[A-Z][0-9]{6}\([0-9A]\)$/; //香港
    let aomenreg = /^[157][0-9]{6}\([0-9]\)$/; //澳门
    //return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    return (userCardreg.test(value) || taiwanreg.test(value) || xianggangreg.test(value) || aomenreg.test(value));
  }

  ////手机验证
  checkPhone(value) {
    return /^1(3|4|5|7|8)\d{9}$/.test(value);
  }

  isNum(val) {
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (val.search(re) != -1) {
      return true;
    } else {
      return false;
    }
  }

  goTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，可能会影响您的使用。'
      })
    }
  }

  get_prevPage(_page) {
    let page = page ? (parseInt(_page) + 1) : 2;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - page];
    if (prevPage == undefined || prevPage == null) return 0;
    return prevPage;
  }

  //倒计时
  formatSeconds(value) {
    value = value.toString();
    let secondTime = parseInt(value); // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    let result = '';
    if (hourTime > 0) {
      result = (parseInt(hourTime) < 10 ? "0" + parseInt(hourTime) : parseInt(hourTime)) + ":";
    }
    if (minuteTime > 0) {
      result += (parseInt(minuteTime) < 10 ? "0" + parseInt(minuteTime) : parseInt(minuteTime)) + ":";
    }
    if (value == 0 || (minuteTime == 0 && secondTime == 0)) {
      return '00:00';
    } else {
      result += parseInt(secondTime) < 10 ? "0" + parseInt(secondTime) : parseInt(secondTime);
    }
    return result;
  }

  /**
   * 获取url参数
   */
  getUrlParam(name, explode, url) {
    let param = url.split('?')[1].substr(1);
    if (url) {
      if (explode) {
        param = url.substr(url.indexOf(explode) + 1);
      } else {
        param = url.substr(url.indexOf('?') + 1);
      }
    } else {
      if (explode) {
        param = url.substr(url.indexOf(explode) + 1);
      }
    }
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = param.match(reg);
    if (r != null) return unescape(r[2]);
    return '';
  }

  getWeekStr(week) {
    switch (week) {
      case "1":
        return "周一"
        break;
      case "2":
        return "周二"
        break;
      case "3":
        return "周三"
        break;
      case "4":
        return "周四"
        break;
      case "5":
        return "周五"
        break;
      case "6":
        return "周六"
        break;
      case "7":
        return "周日"
        break;
      default:
        break;
    }
  }

};

export default tools;
