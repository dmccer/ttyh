import Promise from 'promise/lib/es6-extensions';
import querystring from 'querystring';
import {GET_OPT} from '../const/fetch';

export var Cities = (city, district) => {
  let data = {};

  if (city) {
    data.cityIndex = city;
  }

  if (district) {
    data.districtIndex = district;
  }

  let qs = querystring.stringify(data);
  return fetch(`/mvc/v2/getCitys?${qs}`, GET_OPT);
}
