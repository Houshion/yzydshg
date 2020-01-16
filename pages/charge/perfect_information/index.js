const app = getApp();
const tools = app.tools;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {
                title: '收款人', tip: '请输入收款人姓名', type: 'text', name: 'user_name', value: ''
            },
            {
                title: '身份证号', tip: '请输入身份证号码', type: 'idcard', name: 'id_card', value: ''
            },
            {
                title: '开户银行', tip: '请输入开户银行', type: 'text', name: 'bank_name', value: ''
            },
            {
                title: '开户支行', tip: '请输入开户支行', type: 'text', name: 'bank_children', value: ''
            },
            {
                title: '银行卡号', tip: '请输入银行卡号', type: 'number', name: 'card', value: ''
            }
        ],
        onOff: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type || ''
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
        if (type == 'amend') {
            this.info_show();
        }
    },
    /**
     * 获取是否完善资料
     */
    info_show() {
        const that = this;
        tools.showLoading('加载中');
        app.wxRequest(
            '/Apk/Device/api',
            {api_name: 'cash_show', token: tools.globalData.token},
            (res) => {
                tools.hideLoading();
                if (res.data.code == '1') {
                    const {data} = res.data;
                    let {list} = that.data;
                    list.forEach((item, index) => {
                        if (index == 0) item.value = data.identity_name;
                        if (index == 1) item.value = data.identity_card;
                        if (index == 2) item.value = data.bank_name;
                        if (index == 3) item.value = data.bank_name_son;
                        if (index == 4) item.value = data.bank_num;
                    });
                    that.setData({list});
                } else {
                    tools.showToast(res.data.msg);
                }
            })
    },
    /**
     * 保存
     * @param e
     */
    formSubmit(e) {
        const that = this;
        const {user_name, id_card, bank_name, bank_children, card} = e.detail.value;
        let {onOff} = this.data;
        if (tools.isNull(user_name)) {
            tools.showToast('请输入收款人姓名');
        } else if (tools.isNull(id_card)) {
            tools.showToast('请输入身份证号码');
        } else if (!tools.checkIdCode(id_card)) {
            tools.showToast('身份证号码有误');
        } else if (tools.isNull(bank_name)) {
            tools.showToast('请输入开户银行');
        } else if (tools.isNull(bank_children)) {
            tools.showToast('请输入开户支行');
        } else if (tools.isNull(card)) {
            tools.showToast('请输入银行卡号');
        } else {
            if (onOff) return;
            this.setData({onOff: 1});
            tools.showLoading('请稍候');
            let send_data = {
                api_name: 'cash_data',
                token: tools.globalData.token,
                identity_name: user_name,
                identity_card: id_card,
                bank_name,
                bank_name_son: bank_children,
                bank_num: card
            };
            app.wxRequest(
                '/Apk/Device/api',
                send_data,
                (res) => {
                    tools.hideLoading();
                    if (res.data.code == '1') {
                        tools.showToast('保存成功');
                        setTimeout(() => {
                            tools.navigateBack();
                        }, 1500);
                    } else {
                        that.setData({onOff: 0});
                        tools.showToast(res.data.msg);
                    }
                })
        }
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