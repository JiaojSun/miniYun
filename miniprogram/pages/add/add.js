// 注册page
Page({
  data: {
    dateInfo:{},
    year: '',
    month: '',
    day: '',
    week: '',
    teaName: '',
    fromTime: '09:01',
    toTime: '09:01',
    toTimeStart: '09:02',
    min: 0,
    students: [
      '请选择',      
      '刘禾君',
      '于肖平',
      '王金华&刘丽荣',
      '周瑜',
      '王艺蓉&徐景美&孙小于',
      '杨小君',
      '李平'
    ],
    indexStu: 0,
    multiIndex: [0, 0, 0],
    multiArray: [['一级', '二级', '三级'], ['勾','抹','托'], ['《春江花雨夜》', '《上学歌》']],
    classItems:{
      '0':[
        {
          id:'01',
          name:'勾',
          children:['《春江花雨夜》', '《上学歌》']
        },
        {
          id:'02',
          name:'抹',
          children:['《茉莉花》', '《挤牛奶》']
        },
        {
          id:'03',
          name:'托',
          children:['《菊花台》', '《哇哈哈》']
        },
      ],
      '1':[
        {
          id:'01',
          name:'摇',
          children:['《汉宫秋月》', '《彩云追月》']
        },
        {
          id:'02',
          name:'劈',
          children:['《画心》', '《枉凝眉》']
        },
        {
          id:'03',
          name:'刮',
          children:['《沧海一声笑》', '《琵琶语》']
        },
      ],
      '2':[
        {
          id:'01',
          name:'滑',
          children:['《梁祝》', '《小城故事》']
        },
        {
          id:'02',
          name:'颤',
          children:['《化蝶》', '《滚滚红尘》']
        },
        {
          id:'03',
          name:'按',
          children:['《红豆》', '《凉凉》']
        },
      ]
    }
  },
  // 页面加载的时候执行，只会执行一次
  onLoad: function (options) {
    let dateInfo = JSON.parse(options.dateInfo);
    this.setData({
      year: dateInfo.year,
      month: dateInfo.month,
      day: dateInfo.day,
      week: dateInfo.week,
      teaName: dateInfo.teaName,
      dateInfo
    });
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let stus = this.data.students[this.data.indexStu];
    let students = stus.split('&');
    let level = this.data.multiArray[0][this.data.multiIndex[0]];
    let fingering = this.data.multiArray[1][this.data.multiIndex[1]];
    let tune = this.data.multiArray[2][this.data.multiIndex[2]];
    let remark = e.detail.value.input;
    let data = {
        year: this.data.year,
        month: this.data.month,
        day: this.data.day,
        week: this.data.week,
        teaName: this.data.teaName,
        fromTime: this.data.fromTime, 
        toTime: this.data.toTime, 
        long: this.data.min,
        indexStu: this.data.indexStu,
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex,
        dataStudents:this.data.students,
        students: students,
        level: level,
        fingering: fingering, 
        tune: tune, 
        remark: remark,
    }
    /* testData */
    //   data: {
    //     year: '2019',
    //     month: '1',
    //     day: '18',
    //     week: '星期五',
    //     teaName: '庄老师',
    //     fromTime: '13:30', 
    //     toTime: '14:30', 
    //     long: 60,
    //     students: ['李小叶', '刘小宇',],
    //     fingering: '大搓', 
    //     tune: '《春江花月夜》', 
    //     remark: '无',
    //   },


    const db = wx.cloud.database();
    db.collection('timetable').add({
      data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          _id: res._id
        })
        wx.showToast({
          title: '新增记录成功',
        })
        // this.loadData();
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    

  },
  onBack() {
    console.log('form发生了reset事件');
    wx.navigateBack({
      delta: 1
    })
  },
  bindFromTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      fromTime: e.detail.value
    })
    let {fromTime, toTime} = this.data;
    let min = this.calculateMin(fromTime,toTime);
    this.setData({
       min
    });
  },
  bindToTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      toTime: e.detail.value
    });
    let {fromTime, toTime} = this.data;
    let min = this.calculateMin(fromTime,toTime);
    this.setData({
       min
    });
  },
  calculateMin(fromTime, toTime){
    let result = 0;
    let tempF = fromTime.split(':');
    let tempT = toTime.split(':');
    let minF = parseInt(tempF[0])*60 + parseInt(tempF[1]);
    let minT = parseInt(tempT[0])*60 + parseInt(tempT[1]);
    result = minT - minF;
    return result;
  },
  bindStudentChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexStu: e.detail.value
    })
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      classItems: this.data.classItems
    }
    data.multiIndex[e.detail.column] = e.detail.value;
    // 第一列的值
    let num1 = data.multiIndex[0];
    let num2 = data.multiIndex[1];
    if(e.detail.column == 0){ //修改第一列
      let tempArr1 = data.classItems[num1].map(item=>item.name);
      data.multiArray[1] = tempArr1;
    }
    let tempArr2 = data.classItems[num1][num2].children;
    data.multiArray[2] = tempArr2;
    this.setData(data);
  },
  onGetDataInfo(ev){
    let {year,month,day,week,teaName} = ev.detail
    this.setData({
      year,
      month,
      day,
      week,
      teaName
    });
  },
  test(){

  }
})