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

/**
 * 提交举报
 * @param  {Object} params
 * @param  {String} params.tel 被举报人手机号
 * @param  {String|Number} params.reportType 举报类型
 * @param  {String} params.reason 举报理由
 * @return {Promise}
 */
export var SubmitReport = (params) => {
  return fetch('/mvc/v2/report', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}
