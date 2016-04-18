import querystring from 'querystring';
import {GET_OPT} from '../const/fetch';

/**
 * 获取地址
 * @param  {Array} ...args
 * @param  {Number} args[0] 大区
 * @param  {Number} args[1] 省
 * @param  {Number} args[2] 市
 * @return {Promise}
 */
export var Cities = (...args) => {
  let qs = querystring.stringify({
    index: args.join()
  });
  return fetch(`/mvc/v2/getCitysByArea?${qs}`, GET_OPT);
}
