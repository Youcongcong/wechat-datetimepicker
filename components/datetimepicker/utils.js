function isDef(value) {
  return value !== undefined && value !== null;
}
const currentYear = new Date().getFullYear();
const isValidDate = date => isDef(date) && !isNaN(new Date(date).getTime());

function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function _getTrueValue(formattedValue) {
  if (!formattedValue) return;

  while (isNaN(parseInt(formattedValue, 10))) {
    formattedValue = formattedValue.slice(1);
  }

  return parseInt(formattedValue, 10);
}
function _getWeeks(year) {
  var d = new Date(year, 0, 1);
  while (d.getDay() != 1) {
    d.setDate(d.getDate() - 1);
  }
  var to = new Date(year + 1, 0, 1);
  var i = 1;
  var week = [];
  var weekStr = []   

  for (var from = d; from < to;) {
    var str = '';
    str = str + year + "-" + ((from.getMonth() + 1) <= 9 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1)) + "-" + (from.getDate() <= 9 ? ('0' + from.getDate()) : from.getDate()) + "至";
    from.setDate(from.getDate() + 6);
    if (from < to) {
      str = str + year + "-" + ((from.getMonth() + 1) <= 9 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1)) + "-" + (from.getDate() <= 9 ? ('0' + from.getDate()) : from.getDate());
      from.setDate(from.getDate() + 1);
    } else {
      to.setDate(to.getDate() - 1);
      str = str + year + "-" + ((to.getMonth() + 1) <= 9 ? ('0' + (to.getMonth() + 1)) : (to.getMonth() + 1)) + "-" + (to.getDate() <= 9 ? ('0' + to.getDate()) : to.getDate());
    }
    // var key = `第${i}周`;
    week.push(i)
    weekStr.push(str)
    i++;
  }
  return {
    week,
    weekStr,
  }
}
function _correctValue(value, data) {
  var isDateType = data.type !== 'time';

  if (isDateType && !isValidDate(value)) {
    value = data.minDate;
  } else if (!isDateType && !value) {
    var minHour = data.minHour;
    value = _pad(minHour) + ":00";
  } // time type


  if (!isDateType) {
    var _value$split = value.split(':'),
      hour = _value$split[0],
      minute = _value$split[1];

    hour = _pad(range(hour, data.minHour, data.maxHour));
    minute = _pad(range(minute, data.minMinute, data.maxMinute));
    return hour + ":" + minute;
  } // date type


  value = Math.max(value, data.minDate);
  value = Math.min(value, data.maxDate);
  return value;
}

function _pad(val) {
  return ("00" + val).slice(-2);
}

function _times(n, iteratee) {
  var index = -1;
  var result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

function _getMonthEndDay(year, month) {
  return 32 - new Date(year, month - 1, 32).getDate();
}

function _getBoundary(type, data) {
  var value = new Date(data.innerValue);
  var boundary = new Date(data[type + "Date"]);
  var year = boundary.getFullYear();
  var month = 1;
  var date = 1;
  var hour = 0;
  var minute = 0;

  if (type === 'max') {
    month = 12;
    date = _getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
    hour = 23;
    minute = 59;
  }

  if (value.getFullYear() === year) {
    month = boundary.getMonth() + 1;

    if (value.getMonth() + 1 === month) {
      date = boundary.getDate();

      if (value.getDate() === date) {
        hour = boundary.getHours();

        if (value.getHours() === hour) {
          minute = boundary.getMinutes();
        }
      }
    }
  }

  return {
    [type + "Year"]: year,
    [type + "Month"]: month,
    [type + "Date"]: date,
    [type + "Hour"]: hour,
    [type + "Minute"]: minute
  };
}

function _getRanges(data) {
  if (data.type === 'time') {
    return [{
      type: 'hour',
      range: [data.minHour, data.maxHour]
    }, {
      type: 'minute',
      range: [data.minMinute, data.maxMinute]
    }];
  }

  var _this$getBoundary = _getBoundary('max', data),
    maxYear = _this$getBoundary.maxYear,
    maxDate = _this$getBoundary.maxDate,
    maxMonth = _this$getBoundary.maxMonth,
    maxHour = _this$getBoundary.maxHour,
    maxMinute = _this$getBoundary.maxMinute;

  var _this$getBoundary2 = _getBoundary('min', data),
    minYear = _this$getBoundary2.minYear,
    minDate = _this$getBoundary2.minDate,
    minMonth = _this$getBoundary2.minMonth,
    minHour = _this$getBoundary2.minHour,
    minMinute = _this$getBoundary2.minMinute;
  if (data.type === 'year') {
    minYear = currentYear - 5
    maxYear = currentYear
  }
  var result = [{
    type: 'year',
    range: [minYear, maxYear]
  }, {
    type: 'month',
    range: [minMonth, maxMonth]
  }, {
    type: 'day',
    range: [minDate, maxDate]
  }, {
    type: 'hour',
    range: [minHour, maxHour]
  }, {
    type: 'minute',
    range: [minMinute, maxMinute]
  }];
  if (data.type === 'date') result.splice(3, 2);
  if (data.type === 'year-month') result.splice(2, 3);
  if (data.type === 'year') result.splice(1, 4);
  if (data.type === 'year') result.splice(1, 4);
  if (data.type === 'week'){
    let y = new Date(data.innerValue).getFullYear()
    // console.log(data.innerValue);
    // console.log(currentYear);
    // console.log(y);


    var weekrange = _getWeeks(y).week

    // console.log(weekrange);

    result = [{
      type: 'year',
      range: [minYear, maxYear]
    }, {
      type: 'week',
      range: [1, weekrange.length -1]
    }]
  }
  return result;
}


module.exports = {
  isDef: isDef,
  currentYear: currentYear,
  _getTrueValue: _getTrueValue,
  _correctValue: _correctValue,
  _pad: _pad,
  _times: _times,
  _getMonthEndDay: _getMonthEndDay,
  _getBoundary: _getBoundary,
  _getRanges: _getRanges,
  _getWeeks: _getWeeks
};