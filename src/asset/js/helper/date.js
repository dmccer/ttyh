function parse(d) {
  let mm = d.getMonth() + 1;
  let dd = d.getDate();

  if (mm < 10) {
    mm = `0${mm}`;
  }

  if (dd < 10) {
    dd = `0${dd}`;
  }

  return {
    y: d.getFullYear(),
    m: mm,
    d: dd
  };
}

export default {
  isToday: (d) => {
    let now = new Date();
    let _d = new Date(d);

    return _d.setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0);
  },
  format: (d: Date, tpl: String='YYYY-MM-DD') => {
    let r = parse(d);

    return tpl.replace('YYYY', r.y).replace('MM', r.m).replace('DD', r.d);

    // return `${r.y}-${r.m}-${r.d}`;
  },

  toLocaleDateString: (d) => {
    let r = parse(d);
    return `${r.y}年${r.m}月${r.d}日`;
  }
}
