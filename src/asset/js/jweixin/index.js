export default class JWeiXin {
  constructor(fn) {
    // location.href.split('#')[0]
    this.url = encodeURIComponent('http://www.ttyhuo.com');
    this.fn = fn;

    this.config();
  }

  config() {
    $.get(`/mvc/bbs_v2/jsapi?url=${this.url}`, null, (data) => {
      if (!data) {
        return;
      }

      wx.config(Object.assign({
        debug: false,
        appId: 'wx13306fcc7460426e',
        jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
      }, data));

      wx.ready(this.fn);

      wx.error((res) => {
        alert('验证失败');
        console.log('微信验证失败', res);
      })
    });
  }
}
