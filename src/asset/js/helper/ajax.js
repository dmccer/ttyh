/**
 * AjaxHelper
 *
 * @Author xiaoyunhua@ttyhuo.cn
 *
 * Usage:
 *
 * componentDidMount() {
 * 		this.ajaxHelper = new AjaxHelper(this.refs.loading, this.refs.toast);
 * }
 *
 * fetch() {
 * 		this.ajaxHelper.one(MainBizCard, res => {
 * 			// code
 * 		}, uid);
 *
 * 		this.ajaxHelper.all([MainBizCard, BizCardDetail], res => {
 * 			// code
 * 		}, [uid, cid]);
 * }
 */
import querystring from 'querystring';
// import Promise from 'promise';
import Detect from './detect';
import Log from '../log/';

const noop = () => {};

export default class AjaxHelper {
  constructor(loading, toast) {
    this.loading = loading;
    this.toast = toast;

    this.loadingState = !!loading;
    this.toastState = !!toast;
  }

  r403(res: Object) {
    this.toastState && this.toast.warn('未登录,进入登录页面中...');

    setTimeout(() => {
      let qs = querystring.stringify({
        ref: location.href
      });

      let url;

      if (Detect.isWeiXin()) {
        url = location.protocol + '//' + location.host + `/pim/wxpim/authorize?${qs}`;
      } else {
        url = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, `/login.html?${qs}`)
      }

      location.replace(url);

      return;
    }, 1500);


    let err = new Error(res.statusText);
    err.res = res;
    throw err;
  }

  r50x(res: Object) {
    this.toastState && this.toast.warn(`请求服务器出错, ${res.statusText}`);

    let err = new Error(res.statusText);
    err.res = res;
    throw err;
  }

  ckStatus(res: Object) {
    if (res.status >= 200 && res.status < 300 || res.ok) {
      return res.json();
    }

    if (res.status === 403) {
      return this.r403(res);
    }

    return this.r50x(res);
  }

  all(models: Array<Object>, cb: Object, ...args) {
    let ok, fail = noop;

    if (typeof cb === 'function') {
      ok = cb;
    } else {
      ok = cb.success;
      fail = cb.error;
    }

    this.loadingState && this.loading.show('请求中...');

    let ps = models.map((model, index) => {
      return model.apply(this, args[index])
        .then(this.ckStatus.bind(this))
        .then(res => {
          this.loadingState && this.loading.close();

          return res;

          // if (res.retcode === 0) {
          //   return res;
          // }
          //
          // this.toastState && this.toast.warn(res.msg);
          // // 业务错误处理
          // fail(res);

          // let err = new Error('业务错误');
          // err.res = res;
          // throw err;
        });
    });

    Promise
      .all(ps)
      .then(ok)
      .catch(err => {
        this.loadingState && this.loading.close();
        fail(err);
        // 50x err 和 运行时错误
        Log.error(err);
      });
  }

  one(model: Object, cb: Object, ...args) {
    let ok, fail = noop;

    if (typeof cb === 'function') {
      ok = cb;
    } else {
      ok = cb.success;
      fail = cb.error;
    }

    this.loadingState && this.loading.show('请求中...');

    model.apply(this, args)
      .then(this.ckStatus.bind(this))
      .then(res => {
        this.loadingState && this.loading.close();

        ok(res);

        // if (res.retcode === 0) {
        //   ok(res);
        //
        //   return;
        // }
        //
        // this.toastState && this.toast.warn(res.msg);
        // // 业务错误处理
        // fail(res);
      })
      .catch(err => {
        this.loadingState && this.loading.close();
        fail(err);
        // 50x err 和 运行时错误
        Log.error(err);
      });
  }
}
