import querystring from 'querystring';
import assign from 'lodash/object/assign';
import keys from 'lodash/object/keys';
import {POST_OPT, GET_OPT} from '../../const/fetch';

export var FollowUser = (uid: String) => {
  return fetch(`/mvc/followForBBS_${uid}`, GET_OPT);
}

/**
 * 获取车型列表
 * @return {Promise}
 */
export var TruckTypes = () => {
  return fetch('/mvc/v2/getTruckType', GET_OPT);
}

/**
 * 获取车长列表
 * @return {Promise}
 */
export var TruckLengths = () => {
  return fetch('/mvc/v2/getTruckLength', GET_OPT);
}

export var TruckSearchLengths = () => {
  return fetch('/mvc/v2/getSearchLength', GET_OPT);
}

export var TruckLoadLimits = () => {
  return fetch('/mvc/v2/getLoadLimit', GET_OPT);
}

export var AddTruck = (params) => {
  return fetch('/mvc/v2/insertTruck', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var EditTruck = (params) => {
  return fetch('/mvc/v2/updateTruck', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var GetTruck = (tid) => {
  let qs = querystring.stringify({
    truckID: tid
  });
  return fetch(`/mvc/v2/getTruckById?${qs}`, GET_OPT);
}

export var TruckUsers = (tid) => {
  let qs = querystring.stringify({
    routeIDs: tid
  });
  return fetch(`/mvc/searchUsersForH5?${qs}`, GET_OPT);
}

export var MyTruckRoutes = (params) => {
  let qs = querystring.stringify(params);
  return fetch(`/mvc/v2/getRouteList?${qs}`, GET_OPT);
}

export var RePubTruckRoutes = (trid) => {
  return fetch('/mvc/v2/routeinfo_refresh_json', assign({
    body: querystring.stringify({
      routeID: trid
    })
  }, POST_OPT));
}

export var DelTruckRoutes = (trid) => {
  return fetch('/mvc/v2/closeTruck', assign({
    body: querystring.stringify({
      routeID: trid
    })
  }, POST_OPT));
}

export var TruckTags = () => {
  return fetch('/mvc/v2/getTruckTag', GET_OPT);
}

export var PubTruckRoute = (params) => {
  return fetch('/mvc/v2/newDriverShuoShuo', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var MyTrucks = () => {
  return fetch('/mvc/v2/getTruck', POST_OPT);
}

export var DelTruck = (tid) => {
  return fetch('/mvc/v2/deleteTruck', assign({
    body: querystring.stringify({
      truckID: tid
    })
  }, POST_OPT));
}

export var SetDefaultTruck = (tid) => {
  return fetch('/mvc/v2/setTruckDefalt', assign({
    body: querystring.stringify({
      truckID: tid
    })
  }, POST_OPT));
}

export var TodayRecommendTruckRoutes = (params) => {
  let qs = querystring.stringify(params);
  return fetch(`/mvc/todayRecommendUsersForH5?${qs}`, GET_OPT);
}
