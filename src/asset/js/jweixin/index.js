import Log from '../log/';
import {GET_OPT} from '../const/fetch';

export default class JWeiXin {
  static isWeixinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false ;
  }

  constructor(fn) {
    this.url = encodeURIComponent(location.href.split('#')[0]);
    this.fn = fn;

    this.config();
  }

  config() {
    fetch(`/api/bbs_v2/jsapi?url=${this.url}`, GET_OPT)
      .then(res => res.json())
      .then((data) => {
        if (!data) {
          return;
        }

        let config = {
          debug: false,
          appId: 'wx13306fcc7460426e',
          timestamp: data.timestamp,
          nonceStr: data.noncestr,
          signature: data.signature,
          jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        };

        wx.config(config);

        wx.ready(this.fn);

        wx.error((res) => {
          console.log('微信验证失败', res);
        })
      })
      .catch(err => {
        Log.error(err);
      });
  }
}
