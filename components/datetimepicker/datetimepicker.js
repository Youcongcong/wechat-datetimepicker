const {
  currentYear,
  _getTrueValue,
  _correctValue,
  _pad,
  _times,
  _getMonthEndDay,
  _getRanges,
  _getWeeks
} = require('./utils')

Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    value: {
      type: Number,
      value: 0,
      observer: 'watchValueFun'
    },
    title: String,
    loading: Boolean,
    itemHeight: {
      type: Number,
      value: 44
    },
    visibleItemCount: {
      type: Number,
      value: 5
    },
    confirmButtonText: {
      type: String,
      value: '确认'
    },
    cancelButtonText: {
      type: String,
      value: '取消'
    },
    type: {
      type: String,
      value: 'datetime',
      observer: 'watchTypeFun'
    },
    showToolbar: {
      type: Boolean,
      value: true
    },
    showCloseButton: {
      type: Boolean,
      value: true
    },
    minDate: {
      type: Number,
      value: new Date(currentYear - 10, 0, 1).getTime()
    },
    maxDate: {
      type: Number,
      value: new Date(currentYear + 10, 11, 31).getTime()
    },
    minHour: {
      type: Number,
      value: 0
    },
    maxHour: {
      type: Number,
      value: 23
    },
    minMinute: {
      type: Number,
      value: 0
    },
    maxMinute: {
      type: Number,
      value: 59
    }
  },

  data: {
    pickerValue: [],
    innerValue: Date.now(),
    columns: null,
    
  },
  attached() {
    var _this4 = this;
    this.watchSetData();
    var innerValue = _correctValue(this.data.value, this.properties);
    this.setData({
      innerValue: innerValue
    }, function () {
      _this4.updateColumnValue(innerValue);
      _this4.triggerEvent('input', innerValue);
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
    watchValueFun(val) {
      var _this2 = this;
      var data = this.data;
      
      val = _correctValue(val, this.data);
      var isEqual = val === data.innerValue;

      if (!isEqual) {
        this.setData({
          innerValue: val
        }, function () {
          _this2.updateColumnValue(val);
          _this2.triggerEvent('input', val);
        });
      }
      this.watchSetData();
     
    },
    
    watchSetData() {
   
      var results = _getRanges(this.data).map(function (_ref) {
        var type = _ref.type,
          range = _ref.range;

        var values = _times(range[1] - range[0] + 1, function (index) {
          var value = range[0] + index;
          value = type === 'year' ? "" + value : _pad(value);
          return value;
        });
        return values;

      });
      this.setData({
        columns: results
      })
      
      return results;
    },
    _getWeekOfYear(date){
        var today = new Date(date);
        var firstDay = new Date(today.getFullYear(),0, 1);
        var dayOfWeek = firstDay.getDay(); 
        var spendDay= 1;
        if (dayOfWeek !=0) {
          spendDay=7-dayOfWeek+1;
        }
        firstDay = new Date(today.getFullYear(),0, 1+spendDay);
        var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
        var result =Math.ceil(d/7);
        return result+1;
    },
    getRanges: function getRanges() {
      return _getRanges(this.properties.type, this.data.innerValue)
    },
    onCancel: function onCancel() {
      this.triggerEvent('cancel');
    },
    onConfirm: function onConfirm() {
      this.triggerEvent('confirm', this.data.innerValue);
    },
    onChange: function onChange(event) {
      var _this3 = this;

      var data = this.data;
      var pickerValue = event.detail.value;
      var values = pickerValue.slice(0, data.columns.length).map(function (value, index) {
        return data.columns[index][value];
      });
      var value;

      if (data.type === 'time') {
        value = values.join(':');
      }else if(data.type == 'week'){
        var year = _getTrueValue(values[0]);
        var weeks = _getWeeks(year).weekStr;
        var current =  weeks[values[1]-1].split('至')[0]
        var end = weeks[values[1]-1].split('至')[1]
        var value = new Date(current)
        this.setData({
          innerValue: value,
          
        }, function () {
          // _this3.updateColumnValue(value);
          // _this3.triggerEvent('input', value);

          // _this3.triggerEvent('change', _this3);
        });
        this.triggerEvent('getTimes',{current,end});
      }else {
        var year = _getTrueValue(values[0]);
        var month = _getTrueValue(values[1]);
        var maxDate = _getMonthEndDay(year, month);
        var date = _getTrueValue(values[2]);

        if (data.type === 'year-month') {
          date = 1;
        }

        date = date > maxDate ? maxDate : date;
        var hour = 0;
        var minute = 0;

        if (data.type === 'datetime') {
          hour = _getTrueValue(values[3]);
          minute = _getTrueValue(values[4]);
        }

        value = new Date(year, month - 1, date, hour, minute);
      }
      if(data.type != 'week'){
        month = month >= 10 ? month : `0${month}`
        date = date >= 10 ? date : `0${date}`
        var showValue = `${year}-${month}-${date}`
        var valueStr = `${year}-${month}-${date}`
        value = _correctValue(value, this.properties);
        this.setData({
          showValue,
          innerValue: value,
          
        }, function () {
          // _this3.updateColumnValue(value);
          _this3.triggerEvent('input', value);

          _this3.triggerEvent('change', _this3);
        });

        this.triggerEvent('getTimes',{value,valueStr});
      }
    },
    getColumnValue: function getColumnValue(index) {
      return this.getValues()[index];
    },
    setColumnValue: function setColumnValue(index, value) {
      var _this$data = this.data,
        pickerValue = _this$data.pickerValue,
        columns = _this$data.columns;
      pickerValue[index] = columns[index].indexOf(value);
      this.setData({
        pickerValue: pickerValue
      }, () => {
        this.watchSetData()
      });
    },
    getColumnValues: function getColumnValues(index) {
      return this.data.columns[index];
    },
    setColumnValues: function setColumnValues(index, values) {
      var columns = this.data.columns;
      columns[index] = values;
      this.setData({
        columns: columns
      });
    },
    getValues: function getValues() {
      var _this$data2 = this.data,
        pickerValue = _this$data2.pickerValue,
        columns = _this$data2.columns;
      return pickerValue.map(function (value, index) {
        return columns[index][value];
      });
    },
    setValues: function setValues(values) {
      var columns = this.data.columns;
      this.setData({
        pickerValue: values.map(function (value, index) {
          return columns[index].indexOf(value);
        })
      },  () => {
        this.watchSetData()
      });
    },
    updateColumnValue: function updateColumnValue(value) {
      var values = [];
      var columns = this.data.columns;

      if (this.properties.type === 'time') {
        var currentValue = value.split(':');
        values = [columns[0].indexOf(currentValue[0]), columns[1].indexOf(currentValue[1])];
      } else {
       
        var date = new Date(value);
        values = [columns[0].indexOf("" + date.getFullYear()), columns[1].indexOf(_pad(date.getMonth() + 1))];
        if (this.properties.type === 'date') {
          values.push(columns[2].indexOf(_pad(date.getDate())));
        } 
        if (this.properties.type == 'week'){
          //初始化周
          var week = this._getWeekOfYear(value);
          var date = new Date(value);
          values = [columns[0].indexOf("" + date.getFullYear()), columns[1].indexOf(_pad(week))];
        }
        if (this.properties.type === 'datetime') {
          values.push(columns[2].indexOf(_pad(date.getDate())), columns[3].indexOf(_pad(date.getHours())), columns[4].indexOf(_pad(date.getMinutes())));
        }
      }

      this.setData({
        pickerValue: values
      },  () => {
        // this.watchSetData()
      });
    }
  }
})
