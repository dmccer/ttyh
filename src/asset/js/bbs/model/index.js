import querystring from 'querystring';
import assign from 'lodash/object/assign';
import {POST_OPT, GET_OPT} from '../../const/fetch';
import fetchJsonp from 'fetch-jsonp';

/**
 * 检查是否有新的帖子和回复
 * @param  {String} uid 用户ID
 * @return {Promise}
 */
export var CheckHasNewPostsOrReplies = (uid: String) => {
  let qs = querystring.stringify({
    uid: uid
  });

  return fetch(`/api/bbs_v2/has_remind?${qs}`, GET_OPT);
}

/**
 * 我的评论列表
 * @param  {Object} params
 * @param  {String} params.uid
 * @return {Promise}
 */
export var MyCommends = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_my_commend?${qs}`, GET_OPT);
}

export var MyForums = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_my_forum?${qs}`, GET_OPT);
}

export var RemoveCommend = (params: Object) => {
  return fetch('/api/bbs_v2/_del', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var ClearRemind = (id: String) => {
  return fetch('/api/bbs_v2/clear_remind', assign({
    body: querystring.stringify({
      id: id
    })
  }, POST_OPT));
}

export var HotUser = (uid: String) => {
  let qs = querystring.stringify({
    uid: uid
  });
  return fetch(`/api/bbs_v2/hot_user?${qs}`, GET_OPT);
}

export var FollowUser = (uid: String) => {
  return fetch(`/mvc/followForBBS_${uid}`, GET_OPT);
}

export var Forum = (uid: String, fid: String) => {
  let qs = querystring.stringify({
    uid: uid,
    id: fid
  });
  return fetch(`/api/bbs_v2/show_forum?${qs}`, GET_OPT);
}

export var Comment = (params: Object) => {
  return fetch('/api/bbs_v2/comment', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var Comments = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_commend?${qs}`, GET_OPT);
}

export var Praise = (params: Object) => {
  return fetch('/api/bbs_v2/praise', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var Praises = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_praise?${qs}`, GET_OPT);
}

export var AllForums = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_all?${qs}`, GET_OPT);
}

export var FollowedForums = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/show_follow_forums?${qs}`, GET_OPT);
}

export var HotForums = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetch(`/api/bbs_v2/hot_forum?${qs}`, GET_OPT);
}

export var AllPublishedNotice = () => {
  return fetch('/api/bbs_v2/all_public', GET_OPT);
}

export var PubForum = (params) => {
  return fetch('/api/bbs_v2/post', assign({
    body: querystring.stringify(params)
  }, POST_OPT));
}

export var Topics = () => {
  return fetch('/api/bbs/all_topic', GET_OPT);
}

export var BaiduGeo = (params: Object) => {
  let qs = querystring.stringify(params);
  return fetchJsonp(`http://api.map.baidu.com/geocoder/v2/?${qs}`);
}
