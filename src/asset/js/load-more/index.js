import fnu from 'lodash-fn';

let LoadMore = {
  init: (cb, wait=500) => {
    let winH = $(window).height();
    let lastT = 0;

    $(window).on('scroll', fnu.debounce(() => {
      let docH = $(document).height();
      let t = $(window).scrollTop();

      if (t - lastT > 0 && t > docH - winH - 100) {
        cb();
      }

      lastT = t;
    }, wait));
  }
}

export default LoadMore;
