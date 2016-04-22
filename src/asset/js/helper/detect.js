const Detect = {
  isWeiXin: () => {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false ;
  },
  isQQ: () => {
    var ua = navigator.userAgent.toLowerCase();
    return (/mqqbrowser/.test(ua)) ? true : false ;
  }
};

export default Detect;
