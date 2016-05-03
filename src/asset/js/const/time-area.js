// 装车时间段
export const TIME_AREAS = [
  {
    name: '不限',
    id: 0,
    test(h) {
      return h < 12;
    }
  }, {
    name: '上午',
    id: 1,
    test(h) {
      return h < 12;
    }
  }, {
    name: '下午',
    id: 2,
    test(h) {
      return h < 18;
    }
  }, {
    name: '晚上',
    id: 3,
    test(h) {
      return h < 24;
    }
  }
];
