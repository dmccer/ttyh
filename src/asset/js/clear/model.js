import querystring from 'querystring';
import {GET_OPT} from '../const/fetch';

export var UnbindWX = () => {
  return fetch(`/mvc/wx/logoutAndUnbound`, GET_OPT);
}
