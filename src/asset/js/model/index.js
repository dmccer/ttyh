import querystring from 'querystring';
import assign from 'lodash/object/assign';
import {POST_OPT, GET_OPT} from '../const/fetch';

export var OrderedEnumValue = (type) => {
  let qs = querystring.stringify({
    type: type
  });
  return fetch(`/mvc/v2/getOrderEnumValue?${qs}`, GET_OPT);
}
