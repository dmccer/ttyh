import querystring from 'querystring';
import assign from 'lodash/object/assign';
import {POST_OPT, GET_OPT} from '../const/fetch';

/**
 * 获取枚举
 * @param  {String} type 枚举类型
 * @return {Promise}
 */
export var OrderedEnumValue = (type) => {
  let qs = querystring.stringify({
    type: type
  });
  return fetch(`/mvc/v2/getOrderEnumValue?${qs}`, GET_OPT);
}

export var SubmitReport = (params) => {
  return fetch(`/mvc/v2/praise_report`, assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}
