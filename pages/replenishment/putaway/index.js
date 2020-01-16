const app = getApp();
const tools = app.tools;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue: '',
        list: [],
        loading: true,
        goods_id: '',
        onOff:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            macno: options.macno || '',
            device_goods_id: options.device_goods_id || ''
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
        const {macno, device_goods_id, inputValue} = this.data;
        tools.showLoading('加载中');
        let data = {
            api_name: 'putaway_goods_list',
            token: tools.globalData.token,
            macno,
            device_goods_id,
        };
        if (!tools.isNull(inputValue)) {
            data.title = inputValue;
        }
        app.wxRequest('/app/staff/api', data, (res) => {
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
     * 搜索商品
     */
    search_click() {
        this.get_list();
    },
    search_btn(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    radioChange(e) {
        this.setData({
            goods_id: e.detail.value
        })
    },
    /**
     * 上架
     */
    up_click() {
        const {device_goods_id, goods_id} = this.data;
        const that = this;
        let { onOff } = this.data;
        if(!goods_id){
            tools.showToast('请选择商品');
            return;
        }
        if(onOff)return;
        this.setData({onOff:1});
        tools.showLoading('请稍候');
        let data = {
            api_name: 'device_goods_road_set',
            token: tools.globalData.token,
            status: 1,
            device_goods_id,
            goods_id
        };
        app.wxRequest('/app/staff/api', data, (res) => {
            tools.hideLoading();
            if (res.data.code == 1) {
                tools.showToast('上架成功');
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