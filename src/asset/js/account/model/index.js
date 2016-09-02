import querystring from 'querystring';
import assign from 'lodash/object/assign';
import {POST_OPT, GET_OPT} from '../../const/fetch';

/**
 * 发送验证码
 * @param  {String} tel 手机号
 * @return {Promise}
 */
export var SendVerifyCode = (tel) => {
  return fetch('/mvc/v3/loginJsonNew', assign({
    body: querystring.stringify({
      accountNo: tel
    })
  }, POST_OPT));
}

const LOGIN_URL = {
  1: '/mvc/v3/login_confirmJsonNew',
  2: '/mvc/v3/registerJsonNew'
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

export var UserVerifyStatus = () => {
  return fetch('/mvc/wx/getVerifyStatus', GET_OPT);
}

export var RealNameCertify = (params) => {
  return fetch('/mvc/wx/editUserVerifyJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var RealNameCertifyStatus = () => {
  return fetch('/mvc/wx/editUserVerifyJson', GET_OPT);
}

export var CompanyCertify = (params) => {
  return fetch('/mvc/wx/editCompanyInfoJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var CompanyCertifyStatus = () => {
  return fetch('/mvc/wx/editCompanyInfoJson', GET_OPT);
}

export var TruckerCertify = (params) => {
  return fetch('/mvc/wx/editTruckInfoJsonForH5', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var TruckerCertifyStatus = () => {
  return fetch('/mvc/wx/editTruckInfoJson', GET_OPT);
}
