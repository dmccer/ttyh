/**
 * JS-SDK 微信验证
 *
 * Usage:
 *
 * // 微信验证成功，JS-SDK 准备完毕回调
 * function callback() {}
 *
 * // 微信验证参数
 * let conf = {
 *  url: '/api/bbs_v2/jsapi',
 * 	appId: 'wx13306fcc7460426e',
 * 	jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage']
 * }
 *
 * // 验证
 * WXVerify(conf, callback);
 */
import Detect from './detect';
import {GET_OPT} from '../const/fetch';
import Log from '../log/';

let WXVerify = (conf, cb) => {
  if (!conf) {
    throw new Error('WXVerify 缺少 conf 参数');
  }

  if (!conf.appId) {
    throw new Error('WXVerify 配置缺少 appId');
  }

  if (!conf.jsApiList || !conf.jsApiList.length) {
    throw new Error('WXVerify 配置缺少 jsApiList');
  }

  let url = encodeURIComponent(location.href.split('#')[0]);

  fetch(`${conf.url}?url=${url}`, GET_OPT)
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      let err = new Error(res.statusText);
      err.res = res;
      throw err;
    })
    .then(data => {
      if (!data) {
        throw new Error('获取签名失败');
      }

      wx.config({
        debug: false,
        appId: conf.appId,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signature,
        jsApiList: conf.jsApiList
      });

      wx.ready(cb);
      wx.error((...args) => {
        console.warn(JSON.stringify(args));
        args.unshift(new Error('微信验证失败'));
        cb && cb.apply(this, args);
      });
    })
    .catch(err => {
      Log.error(err);
    });
}

export default WXVerify;
