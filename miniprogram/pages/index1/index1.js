// pages/index/index.js
// 注册page
const app = getApp()
Page({
  data: {
    _id:'',
    list: [],
    todayDate: '',
    start: 0,
    loading: false,
    year:'',
    month:'',
    day:'',
    week:'',
    teaName:'',
    schedules: [],
    isHistory: 1
  },
  // 页面加载的时候执行，只会执行一次
  onLoad: function (options) {
    // 获取openid
    this.getOpenid();
    // this.loadData();
  },
  onShow(){
    // this.loadData();
  },
  getOpenid(){
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        if(app.globalData.openid){
          this.loadData();
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onShowtemp: function(){
    const db = wx.cloud.database();
    var tempId = this.data._id;
    db.collection('timetable').where({
      _id: tempId
    }).get().then(res=>{
      console.log(res.data);
    })
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
  onAdd() {
    let dateInfo = {
      year: this.data.year,
      month: this.data.month,
      day:this.data.day,
      week:this.data.week,
      teaName: this.data.teaName
    }
    wx.navigateTo({
      url: '/pages/add/add?dateInfo='+JSON.stringify(dateInfo)
    })
  },
  loadData(flag){
    let {list} = this.data;
    let _openid = app.globalData.openid;
    let {year,month,day,week,teaName} = this.data;
    const db = wx.cloud.database();
    if(!flag){
      wx.showLoading({
        title: '正在拼命加载...',
        mask: true
      })
    }

    db.collection('timetable').where({
      _openid,
      year,
      month,
      day,
      week,
      teaName
    }).orderBy('fromTime', 'asc').get().then(res=>{
      list = [];
      list.push(...res.data);
      this.setData({
        list,
      });
      console.log('取值成功');
      console.log(list);
      wx.hideLoading();
    })
  },
  // 判断是不是历史日期
  judgeHistTime(year,month,day){
    let DateTarget = new Date(year + '/' + month + '/' + day);
    let todayDate = new Date();
    var y = todayDate.getFullYear();
    var m = todayDate.getMonth() + 1;
    var d = todayDate.getDate();
    let dateNow = new Date(y + '/' + m + '/' + d);
    // 相差天数
    var iday = parseInt(dateNow - DateTarget) / 1000 / 60 / 60 / 24;
    if(iday > 0){
      return true;
    }
    return false;
  },
  onGetDataInfo(ev){
    let {year,month,day,week,teaName} = ev.detail;
        // 判断日期是不是今天以前，是的话ishistory变为true
    let isHistory = this.judgeHistTime(year,month,day);
    this.setData({
      year,
      month,
      day,
      week,
      teaName,
      isHistory
    });
    this.loadData();
  },
  // 删除一项
  deleteOne(event) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '你确定删除吗?',
      success(res) {
        if (res.confirm) {
          const _id = event.currentTarget.dataset.id;
          if (_id) {
            _this.deletedetail(_id);
          } else {
            wx.showToast({
              title: '无记录可删，请见创建一个记录',
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deletedetail(id){
    const db = wx.cloud.database()
    db.collection('timetable').doc(id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.loadData(true);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  // 修改一项内容(不允许修改姓名)
  updateOne(event){
    const _id = event.currentTarget.dataset.id;
    let dateInfo = {
      year: this.data.year,
      month: this.data.month,
      day:this.data.day,
      week:this.data.week,
      teaName: this.data.teaName,
      _id: _id
    }
    if(_id){
      wx.navigateTo({
        url: '/pages/edit/edit?dateInfo='+JSON.stringify(dateInfo)
      })
    }
  }



})