/**
 * 上拉加载更多
 *
 * Usage:
 *
 * // 滚动到底部就会触发 cb, 800ms 内连续多次滚动到底部只算一次
 * function cb() {
 * 		// fetch more data
 * }
 *
 * LoadMore.init(cb, 800)
 */
import fnu from 'lodash-fn';

let LoadMore = {
  init: (cb, wait=500) => {
    let winH = $(window).height();
    let lastT = 0;

    $(window).on('scroll', fnu.debounce(() => {
      let docH = $(document).height();
      let t = $(window).scrollTop();

      if (docH < winH) {
        return;
      }

      if (t - lastT > 0 && t > docH - winH - 100) {
        cb();
      }

      lastT = t;
    }, wait));
  }
}

export default LoadMore;
