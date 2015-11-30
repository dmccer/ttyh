import './item.less';

import React from 'react';

export default class Comment extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <li className="comment-item">
        <header className="row">
          <div className="profile">
            <i className="avatar"></i>
            <div className="poster">用户名</div>
            <div className="post-meta"><span className="floor">1楼</span><i className="icon icon-clock"></i>刚刚</div>
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit"></i>30</span>
            <span><i className="icon icon-praise"></i>11</span>
          </div>
        </header>
        <article className="post-body">
          <section className="post-content">
            <p className="post-text">这里是正文，长长的正文，好吧，加油吧，快点吧，gogogo~，no, 再长点吧，来，再长点</p>
            <div className="photo">
              <a href="#"><img src="http://img1.ph.126.net/YoeTcZOUqh9cX7nrFLk09A==/6631415211375428308.jpg" /></a>
            </div>
            <div className="replied">
              <i className="icon icon-quote">『</i>
              <p className="replied-content"><span className="head">回复<b>1</b>楼: </span>评论要长很长，很长呢，我是评论真的我是评论，一定要长很长很长的~~~~</p>
            </div>
          </section>
        </article>
      </li>
    )
  }
}
