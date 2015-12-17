export default class JWeiXin {
  constructor(fn) {
    this.url = encodeURIComponent(location.href.split('#')[0]);
    this.fn = fn;

    this.config();
  }

  config() {
    $.getJSON(`/mvc/bbs_v2/jsapi?url=${this.url}`, null, (data) => {
      if (!data) {
        return;
      }

      let config = Object.assign({
        debug: false,
        appId: 'wx13306fcc7460426e',
        jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
      }, data)

      console.log(config);

      wx.config(config);

      wx.ready(this.fn);

      wx.error((res) => {
        alert('验证失败');
        console.log('微信验证失败', res);
      })
    });
  }
}
