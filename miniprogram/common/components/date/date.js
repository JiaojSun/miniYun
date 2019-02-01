const date = new Date()
const years = []
const months = []
const days = []
const weekdays=new Array(7)
weekdays[0]="星期日"
weekdays[1]="星期一"
weekdays[2]="星期二"
weekdays[3]="星期三"
weekdays[4]="星期四"
weekdays[5]="星期五"
weekdays[6]="星期六"

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Component({
  properties:{
    nowDate:Object
  },
  data: {
    years,
    year: date.getFullYear(),
    // year:'',
    months,
    month: date.getMonth()+1,
    // month:'',
    days,
    day: date.getDate(),
    // day:'',
    weekdays,
    week: weekdays[date.getDay()],
    // week:'',
    value: [date.getFullYear(), date.getMonth(), date.getDate()-1,date.getDay()],
    // value:'',
    teaName: '庄老师'
  },
  pageLifetimes: {
    show() { 
      if(this.data.nowDate && Object.keys(this.data.nowDate).length){
        let year = this.data.nowDate.year;
        let month = this.data.nowDate.month;
        let day = this.data.nowDate.day;
        let week = this.data.nowDate.week;
        let teaName = this.data.nowDate.teaName;
        let value = [this.data.nowDate.year, this.data.nowDate.month-1, this.data.nowDate.day-1];
        this.setData({
          year,
          month,
          day,
          value,
          week,
          teaName,
        });
      }

      // for temp
      // this.setData({
      //   day: '27',
      //   value: ['2019', '0', '26']
      // });

      this.triggerEvent('getDataInfo',this.data);


    }
  },
  methods:{
    bindChange(e) {
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]],
        week: this.data.weekdays[new Date(this.data.year,this.data.month,this.data.day).getDay()]
      });
      let day = new Date(this.data.year,this.data.month-1,this.data.day).getDay();
      this.setData({
        week: this.data.weekdays[day]
      });
      this.triggerEvent('getDataInfo',this.data);
    }
  }
})