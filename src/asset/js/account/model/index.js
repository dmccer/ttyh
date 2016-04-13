import Promise from 'promise/lib/es6-extensions';
import querystring from 'querystring';
import assign from 'lodash/object/assign';
import {POST_OPT, GET_OPT} from '../../const/fetch';

/**
 * 发送验证码
 * @param  {String} tel 手机号
 * @return {Promise}
 */
export var SendVerifyCode = (tel) => {
  return fetch('/mvc/loginJsonNew', assign({
    body: querystring.stringify({
      accountNo: tel
    })
  }, POST_OPT));
}

const LOGIN_URL = {
  1: '/mvc/login_confirmJsonNew',
  2: '/mvc/registerJsonNew'
};
/**
 * 登录
 * @param {Object} params
 * @param {String} params.tel 手机号
 * @param {String} params.code 验证码
 * @param {String} params.wx_code 微信中，url 上的查询参数 code
 * @param {String} params.source 用户登录来源 'h5', 'app' ...
 * @return {Promise}
 */
export var Login = (params) => {
  return fetch(LOGIN_URL[params.action], assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var UserInfo = () => {
  return fetch('/mvc/v2/getLoggingUser', GET_OPT);
}

export var RealNameCertify = (params) => {
  return fetch('/mvc/editUserVerifyJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var RealNameCertifyStatus = () => {
  return fetch('/mvc/editUserVerifyJson', GET_OPT);
}

export var CompanyCertify = (params) => {
  return fetch('/mvc/editCompanyInfoJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var CompanyCertifyStatus = () => {
  return fetch('/mvc/editCompanyInfoJson', GET_OPT);
}

export var TruckerCertify = (params) => {
  return fetch('/mvc/editTruckInfoJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var TruckerCertifyStatus = () => {
  return fetch('/mvc/editTruckInfoJson', GET_OPT);
}
