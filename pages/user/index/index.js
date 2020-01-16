// pages/user/index/index.js
const app = getApp();
const tools = app.tools;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        active_color: '#fff',
        indicator_color: '#ccc',
        circular: true,
        loading: true,
        image_list: [],
        currentTab: 0,
        list_data: [
            // {
            //     title: '健身套餐', id: 1, list: [
            //         {id: 1, img: '/img/img1.png', title: '男裝健身套裝', price: 20, inventory: 10, goods_num: 0},
            //         {id: 2, img: '/img/img1.png', title: '男裝健身套裝', price: 30, inventory: 10, goods_num: 0},
            //         {id: 3, img: '/img/img1.png', title: '男裝健身套裝', price: 40, inventory: 10, goods_num: 0}
            //     ]
            // },
            // {
            //     title: '蛋白粉', id: 2, list: [
            //         {id: 4, img: '/img/img1.png', title: '女裝健身套裝', price: 20, inventory: 10, goods_num: 0},
            //         {id: 5, img: '/img/img1.png', title: '女裝健身套裝', price: 30, inventory: 10, goods_num: 0},
            //         {id: 6, img: '/img/img1.png', title: '女裝健身套裝', price: 40, inventory: 10, goods_num: 0}
            //     ]
            // },
            // {
            //     title: '水果', id: 3, list: [
            //         {id: 7, img: '/img/img1.png', title: '男/女健身套裝', price: 20, inventory: 10, goods_num: 0},
            //         {id: 8, img: '/img/img1.png', title: '男/女健身套裝', price: 30, inventory: 10, goods_num: 0},
            //         {id: 9, img: '/img/img1.png', title: '男/女健身套裝', price: 40, inventory: 10, goods_num: 0}
            //     ]
            // },
        ],
        cart_data: [],
        cart_show: false,
        total_num: 0,//总数
        total_price: 0,//总价
        sum_list: [],//存本地的数据
        onOff:0,
        login_status:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.setData({
            total_num: 0,//总数
            total_price: 0,//总价
            sum_list: [],//存本地的数据
            onOff:0
        });
        this.get_mall_data().then((res)=>{
            that.getStorageList();
        })
    },
    listeningEvent(e){
        this.onShow();
    },
    /**
     * 获取商城列表
     */
    get_mall_data() {
        const that = this;
        return new Promise((resolve,reject)=>{
            tools.showLoading('加载中');
            app.wxRequest(
                '/App/Shop/api',
                {api_name: 'get_mall_data'},
                (res) => {
                    tools.hideLoading();
                    if(res.data.code == 1){
                        const { banner, list_data} = res.data.data;
                        let loading = list_data.length > 0 ? true : false;
                        that.setData({
                            banner,
                            list_data,
                            loading
                        });
                        resolve();
                    }else{
                        tools.showToast(res.data.msg);
                    }
                }
            );
        });
    },
    /**
     * 增加和减少商品
     */
    handle_box(e) {
        let {list_data, cart_show} = this.data;
        const dataset = e.currentTarget.dataset;
        const cart_type = dataset.cart_type;
        const index = dataset.index;
        const idx = dataset.idx;
        let goods_num = list_data[idx].list[index].goods_num * 1;
        const type = dataset.type;
        const inventory = list_data[idx].list[index].num * 1;
        const tab_id = list_data[idx].id;
        const list_id = list_data[idx].list[index].id;
        /**
         * 判断是购物车列表还是商品列表
         */
        if (cart_show && cart_type != 'cart') this.setData({cart_show: false});
        if (type == 'add') {//增加
            goods_num++;
        } else {//减少
            goods_num--;
        }
        if (goods_num < 0) {
            tools.showToast('不能再减少了哦！');
            return;
        }
        if (goods_num > inventory) {
            tools.showToast('库存不足');
            return;
        }
        list_data[idx].list[index].goods_num = goods_num;
        this.setStorageList(tab_id, list_id, goods_num);
        this.setData({list_data});
        this.total(list_data);
    },
    /**
     * 存/取购物车数据
     */
    setStorageList(tab_id, list_id, goods_num) {
        let {sum_list} = this.data;
        let list_item = {}, sum_item = {};
        let list = [];
        //存数据
        if (sum_list.length > 0) {
            let sum_inarray = 0;
            sum_list.some((itemName, idx) => {
                if (itemName.id == tab_id) {
                    let inarray = 0;
                    itemName.list.some((item, index) => {
                        if (item.id == list_id) {
                            inarray = 1;
                            item.goods_num = goods_num;
                            return true;
                        } else {
                            list_item.id = list_id;
                            list_item.goods_num = goods_num;
                        }
                    });
                    if (inarray == 0) itemName.list.push(list_item);
                    sum_inarray = 1;
                    return true;
                } else {
                    list_item.id = list_id;
                    list_item.goods_num = goods_num;
                }
            });
            if (sum_inarray == 0) {
                list = [];
                list.push(list_item);
                sum_item.list = list;
                sum_item.id = tab_id;
                sum_list.push(sum_item);
            }
        } else {
            list = [];
            list_item.id = list_id;
            list_item.goods_num = goods_num;
            list.push(list_item);
            sum_item.list = list;
            sum_item.id = tab_id;
            sum_list.push(sum_item);
        }
        wx.setStorageSync('list', sum_list);
    },
    /**
     * 取购物车数据
     */
    getStorageList() {
        //取数据
        let sum_list = wx.getStorageSync('list');
        let {list_data} = this.data;
        // console.log(sum_list);
        // console.log(list_data);
        if (sum_list) {
            sum_list.some((itemName, idx) => {
                list_data.some((item, index) => {
                    if (itemName.id == item.id) {
                        itemName.list.forEach((itemNameChildren, idxChildren) => {
                            item.list.forEach((itemChildren, indexChildren) => {
                                if (itemNameChildren.id == itemChildren.id) {
                                    if (itemNameChildren.goods_num*1 <= itemChildren.num*1) {//购物车数量小于库存
                                        itemChildren.goods_num = itemNameChildren.goods_num;
                                    } else {//购物车数量大于库存
                                        itemChildren.goods_num = itemChildren.num;
                                    }
                                    return true;
                                }
                            })
                        })
                    }
                });
            });
            this.total(list_data);
            this.setData({
                sum_list,
                list_data
            })
        }
    },
    /**
     * 计算总价和总数
     */
    total(e) {
        let total_num = 0,
            total_price = 0;
        e.forEach((itemName, idx) => {
            itemName.list.forEach((item, index) => {
                total_num += item.goods_num * 1;
                total_price += item.price * 1 * item.goods_num * 1;
            })
        });
        total_price = total_price.toFixed(2);
        this.setData({
            total_num,
            total_price
        });
    },
    /**
     * 切换tab
     */
    swichNav(e) {
        const that = this;
        const dataset = e.currentTarget.dataset;
        const {currentTab} = this.data;
        if (currentTab === dataset.index) {
            return false;
        } else {
            that.setData({
                currentTab: dataset.index
            })
        }
    },
    //点击购物车
    cart_click() {
        const {cart_show, total_num, list_data} = this.data;
        if (total_num == 0) {
            tools.showToast('请选择商品');
            return;
        }
        this.setData({
            cart_show: !cart_show
        });
    },
    /**
     * 去支付
     */
    pay_btn() {
        const {total_num, total_price, list_data} = this.data;
        let {onOff } = this.data;
        const that  = this;
        tools.isToken((flag) => {
            if(flag){
                that.setData({
                    login_status:false,
                })
                if (total_num == 0) {
                    tools.showToast('请选择商品');
                    return;
                }
                if(onOff){ return; }
                onOff = 1;
                that.setData({onOff});
                let cart_data = [];
                list_data.forEach((itemName, idx) => {
                    itemName.list.forEach((item, index) => {
                        if (item.goods_num != 0) {
                            cart_data.push({id:item.id,num:item.goods_num});
                        }
                    })
                });
                tools.showLoading('请稍候');
                app.wxRequest(
                    '/App/Shop/api',
                    {api_name: 'cart_pay',goods_data:JSON.stringify(cart_data),token: tools.getStorage('token')},
                    (res) => {
                        tools.hideLoading();
                        console.log(res);
                        if(res.data.code == 1){
                            tools.globalData.confirm_data = res.data.data;
                            tools.globalData.cart_data = cart_data;
                            tools.globalData.address_id = '';
                            tools.navigateTo('/pages/user/confirm_order/index');
                        }else{
                            that.setData({onOff:0});
                            tools.showToast(res.data.msg);
                        }
                    }
                );
            }else{
                that.setData({
                    login_status:true,
                })
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
