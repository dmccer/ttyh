/**
 * ds 结构:
 let ds = [
   {
     type: 'm',
     text: '2016年 1月'
   }, {
     type: 'd',
     year: 2016,
     month: 0,
     children: [
       {
         off: true,
         text: 1
       }, {
         off: true,
         text: 2
       }, {
         off: true,
         text: 3
       }, {
         off: true,
         text: 4
       }, {
         off: true,
         text: 5
       }, {
         off: false,
         text: 6,
         today: true
       }, {
         off: false,
         text: 7
       }
     ]
   }, {
     type: 'd',
     year: 2016,
     month: 0,
     children: [
       {
         off: false,
         text: 8
       }, {
         off: false,
         text: 9
       }, {
         off: false,
         text: 10
       }, {
         off: false,
         text: 11
       }, {
         off: false,
         text: 12
       }, {
         off: false,
         text: 13
       }, {
         off: false,
         text: 14
       }
     ]
   }, {
     type: 'm',
     text: '2016年 2月'
   }, {
     type: 'd',
     year: 2016,
     month: 1,
     children: [
       {
         off: false,
         text: 1
       }, {
         off: false,
         text: 2
       }, {
         off: false,
         text: 3
       }, {
         off: false,
         text: 4
       }, {
         off: false,
         text: 5
       }, {
         off: true,
         text: 6
       }, {
         off: true,
         text: 7
       }
     ]
   }
 ];
 *
 */
import './index.less';

import React, {Component, PropTypes} from 'react';
import Mask from '../mask/';

function getDaysOfMonth(year, month) {
  let ms = new Date(year, month, 1);
  let me = new Date(year, month + 1, 1);
  return (me - ms) / (1000 * 60 * 60 * 24);
}

function getNextMonth(year, month) {
  let nextY, nextM;

  if (month === 11) {
    nextY = year + 1;
    nextM = 0;
  } else {
    nextY = year;
    nextM = month + 1;
  }

  return new Date(nextY, nextM, 1);
}

function weeksOfMonth(year, month, date, count, today) {
  let startDate = new Date(year, month, date);
  let startDay = startDate.getDay();

  let r = [];
  r.push({
    today: today,
    text: date
  });

  let i = 1;
  // 当月有效天数
  while(i < count) {
    r.push({
      text: date + i
    });

    i++;
  }

  // 月前缺 startDay 个空位
  if (startDay > 0) {
    let delta = date - 1 - startDay;

    // 当月能补的最大空位数
    let i = 1;

    while(i < date && i <= startDay) {
      r.unshift({
        off: true,
        text: date - i
      });

      i++;
    }

    if (delta < 0) {
      // 月前天数不够补空
      let emptyCount = Math.abs(delta);

      while(emptyCount-- > 0) {
        r.unshift({
          text: ''
        });
      }
    }
  }

  let lastDate = date + count - 1;
  let lastDateO = new Date(year, month, lastDate);
  let lastDay = lastDateO.getDay();

  if (lastDay < 6) {
    let maxDate = getDaysOfMonth(year, month);

    let i = 1;
    while(i <= maxDate - lastDate && i <= 6 - lastDay) {
      r.push({
        off: true,
        text: lastDate + 1
      });

      i++;
    }

    let delta = maxDate - lastDate - (6 - lastDay);

    if (delta < 0) {
      // 月底天数不够补空
      let emptyCount = Math.abs(delta);

      while(emptyCount-- > 0) {
        r.push({
          text: '',
        });
      }
    }
  }

  let len = r.length;
  let rs = [];

  rs.push({
    type: 'm',
    text: `${year}年 ${month + 1}月`
  });

  i = 0;
  while (i < len) {
    let t = i + 7;
    rs.push({
      type: 'd',
      year: year,
      month: month,
      children: r.slice(i, t)
    });
    i = t;
  }

  return rs;
}

function getDsOfLatest30Days(sDate) {
  let day = sDate.getDay();
  let date = sDate.getDate();
  let month = sDate.getMonth();
  let year = sDate.getFullYear();

  let r = [];

  let maxOfCurMonth = getDaysOfMonth(year, month);
  let countOfCurMonth = maxOfCurMonth - date + 1;

  let curMonthWeeks = weeksOfMonth(year, month, date, countOfCurMonth, true);
  r = r.concat(curMonthWeeks);

  let remainCount = MAX_DAY_COUNT - countOfCurMonth;
  let firstDateOfNextMonth = getNextMonth(year, month);
  let nextYear = firstDateOfNextMonth.getFullYear();
  let nextMonth = firstDateOfNextMonth.getMonth();
  let maxOfNextMonth = getDaysOfMonth(nextYear, nextMonth);
  let needThirdMonth = maxOfNextMonth < remainCount;
  let countOfNextMonth = needThirdMonth ? maxOfNextMonth : remainCount;
  let nextMonthWeeks = weeksOfMonth(nextYear, nextMonth, 1, countOfNextMonth, false);
  r = r.concat(nextMonthWeeks);

  if (needThirdMonth) {
    let delta = remainCount - maxOfNextMonth;
    let firstDateOfThirdMonth = getNextMonth(nextYear, nextMonth);
    let thirdMonthWeeks = weeksOfMonth(firstDateOfThirdMonth.getFullYear(), firstDateOfThirdMonth.getMonth(), 1, delta, false);
    r = r.concat(thirdMonthWeeks);
  }

  return r;
}

const MAX_DAY_COUNT = 30;
export default class DatePicker extends Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  state = {
    ds: []
  };

  show(date: Date) {
    if (!this.state.on) {
      this.setState({
        on: true,
        ds: getDsOfLatest30Days(date)
      });
    }
  }

  close() {
    if (this.state.on) {
      this.setState({
        on: false
      });
    }
  }

  handleSelectDate(year, month, date) {
    let d = new Date(year, month, date);
    this.props.onSelect(d);

    this.close();
  }

  render() {
    let ds = this.state.ds;

    if (!this.state.on || !ds.length) {
      return null;
    }

    let calendar = ds.map((item, index) => {
      let trKey = `tr_${index}`;

      if (item.type === 'm') {
        return (
          <tr className="cld-title" key={trKey}>
            <td colSpan={7}>{item.text}</td>
          </tr>
        );
      }

      if (item.type === 'd') {
        let days = item.children.map((child, index) => {
          return (
            <td
              className={child.off ? 'off' : (child.today ? 'today' : '')}
              key={`${trKey}_td_${index}`}
              onClick={!child.off ? this.handleSelectDate.bind(this, item.year, item.month, child.text) : () => {}}>{child.text}</td>
          );
        });

        return (
          <tr key={trKey}>{days}</tr>
        );
      }
    });

    return (
      <div className="calendar">
        <Mask click={this.close.bind(this)} />
        <table className="cld">
          <thead>
            <tr className="cld-day">
              <th>日</th>
              <th>一</th>
              <th>二</th>
              <th>三</th>
              <th>四</th>
              <th>五</th>
              <th>六</th>
            </tr>
          </thead>
          <tbody>
            {calendar}
          </tbody>
        </table>
      </div>
    );
  }
}
