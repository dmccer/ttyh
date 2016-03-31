import './index.less';

import React, {Component} from 'react';

import Mask from '../mask/';

function getDaysOfMonth(year, month) {
  let ms = new Date(year, month, 1);
  let me = new Date(year, month + 1, 1);
  return (me - ms) / (1000 * 60 * 60 * 24);
}

function getPreDaysOfDate(year, month, date, count) {
  let delta = date - count;
  let r = [];

  if (count === 0) {
    return r;
  }

  if (delta > 0) {
    while(count > 0) {
      r.push(date - count);
      count--;
    }

    return r;
  }

  let daysOfLastMonth = getDaysOfMonth(year, month - 1);

  if (delta === 0) {
    r.push(daysOfLastMonth);

    while(--count > 0) {
      r.push(date - count);
    }

    return r;
  }

  let missTheMonthDaysCount = date - 1;
  let missLastMonthDaysCount = count - missTheMonthDaysCount;
  while(--missLastMonthDaysCount >= 0) {
    r.push(daysOfLastMonth - missLastMonthDaysCount);
  }

  while(missTheMonthDaysCount > 0) {
    r.push(date - missTheMonthDaysCount);
  }

  return r;
}

function getSufDaysOfDate(year, month, date, count) {}

function weekOfDays(days) {
  let i = 0;
  let r = [];
  let len = days.length;

  while (i < len) {
    let t = i + 7;
    r.push(days.slice(i, t));
    i = t;
  }

  return r;
}

let ds = [
  {
    type: 'm',
    text: '2016年 1月'
  }, {
    type: 'd',
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

const MAX_DAY_COUNT = 30;
export default class DatePicker extends Component {
  state = {

  };

  componentDidMount() {
    let now = new Date();
    let day = now.getDay();
    let date = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();

    let maxOfTheMonth = getDaysOfMonth(year, month);
    let lessDateOfTheMonth = maxOfTheMonth - date + 1;

    let r = [], allChildren = [];

    r.push({
      type: 'm',
      text: `${year}年 ${month}月`
    });

    let preDays = getPreDaysOfDate(year, month, date, day);
    let preDaysTransformed = preDays.map(date => {
      return {
        off: true,
        text: date
      };
    });

    allChildren = allChildren.concat(preDaysTransformed).push({
      today: true,
      text: date
    });

    if (lessDateOfTheMonth >= MAX_DAY_COUNT) {
      let i = 0;

      while(++i < MAX_DAY_COUNT) {
        allChildren.push({
          text: date + i
        });
      }

      let sufDaysCount = 7 - allChildren.length % 7;
      let sufDays = getSufDaysOfDate(year, month, date, sufDaysCount);
      let sufDaysTransformed = sufDays.map(date => {
        return {
          off: true,
          text: date
        };
      });

      allChildren = allChildren.concat(sufDaysTransformed);

      let part = weekOfDays(allChildren).map(child => {
        return {
          type: 'd',
          children: child
        };
      });

      r = r.concat(part);

      return;
    }

    let datesCountOfNextMonth = MAX_DAY_COUNT - lessDateOfTheMonth;
    let maxDatesCountOfNextMonth = getDaysOfMonth(year, month + 1);

    if (datesCountOfNextMonth <= maxDatesCountOfNextMonth) {
    
    }
  }

  render() {
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
              key={`${trKey}_td_${index}`}>{child.text}</td>
          );
        });

        return (
          <tr key={trKey}>{days}</tr>
        );
      }
    });

    return (
      <div className="calendar">
        <Mask />
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
