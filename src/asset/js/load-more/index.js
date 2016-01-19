import fnu from 'lodash-fn';

/**
 * 上拉加载更多
 * @type 
 */
let LoadMore = {
  init: (cb, wait=100) => {
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
    }, wait, { leading: true, trailing: true }));
  }
}

export default LoadMore;
