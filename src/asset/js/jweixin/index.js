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

      let config = {
        debug: false,
        appId: 'wx13306fcc7460426e',
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signature,
        jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
      };

      console.log(config)

      wx.config(config);

      wx.ready(() => {
        alert('验证成功');
      });

      wx.error((res) => {
        alert('验证失败');
        console.log('微信验证失败', res);
      })
    });
  }
}
