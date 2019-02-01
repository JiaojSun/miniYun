// pages/index/index.js
// 注册page
Page({
  data: {
    todayDate: '',
    list:[],
    start: 0,
    loading: false
  },
  // 页面加载的时候执行，只会执行一次
  onLoad: function (options) {
    this.loadData();
  },
  tap(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 选择日期触发的事件
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      todayDate: e.detail.value
    })
  },
  lower(){
    console.log( 111 )
    if( !this.data.loading ){
      this.loadData();
    }
  },
  loadData(){
    let { start,list,todayDate } = this.data;
    // 关于日期
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();
    todayDate = year +'-'+ month +'-'+ day;


    wx.showLoading({
      title: '正在拼命加载...',
      mask: true
    })
    this.setData({
      todayDate: todayDate,
      loading: true
    })
    wx.request({
      url: `https://data.miaov.com/h5-view/v/movie/list?start=${this.data.start}`,
      success: (res) => {
        console.log(res);
        start += 20;
        list.push( ...res.data.subjects )
        this.setData({
          list,
          start,
          loading: false
        });
        wx.hideLoading();
      }
    })
  }
})