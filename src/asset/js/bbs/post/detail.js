import './item.less';
import React from 'react';

export default class PostDetailItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="post-item">
        <header className="row">
          <div className="profile">
            <i className="avatar"></i>
            <div className="poster">用户名<i className="flag">楼主</i></div>
            <div className="post-time"><i className="icon icon-clock"></i>刚刚</div>
          </div>
          <div className="poster-actions">
            <span className="follow"><i className="icon icon-plus"></i>关注</span>
            <span className="followed hide"><i className="icon icon-correct"></i>已关注</span>
            <span className="del hide"><i className="icon icon-del"></i>删除</span>
          </div>
        </header>
        <article className="post-body">
          <div className="post-title">
            <h2>我的名字叫标题</h2>
            <span className="browse-count">被浏览 <b>3928</b> 次</span>
          </div>
          <section className="post-content">
            <p className="post-text"><b>#我的名字叫标题#</b>这里是正文，长长的正文，好吧，加油吧，快点吧，gogogo~，no, 再长点吧，来，再长点</p>
            <div className="photo">
              <a href="#"><img src="http://img1.ph.126.net/YoeTcZOUqh9cX7nrFLk09A==/6631415211375428308.jpg" /></a>
            </div>
          </section>
          <div className="address"><i className="icon icon-address"></i>上海-浦东新区</div>
        </article>
      </section>
    );
  }
}
