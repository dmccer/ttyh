import './item.less';
import React from 'react';

export default class PostItem extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <li className="post-item">
        <header className="row">
          <div className="profile">
            <i className="avatar"></i>
            <div className="poster">用户名</div>
            <div className="post-time"><i className="icon icon-clock"></i>刚刚</div>
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-edit"></i>30</span>
            <span><i className="icon icon-praise"></i>11</span>
          </div>
        </header>
        <article className="post-body">
          <h2>我的名字叫标题</h2>
          <section className="post-content">
            <p className="post-text"><b>#我的名字叫标题#</b>这里是正文，长长的正文，好吧，加油吧，快点吧，gogogo~，no, 再长点吧，来，再长点</p>
            <ul className="post-photos">
              <li><a href="#"><img src="" /></a></li>
              <li><a href="#"><img src="" /></a></li>
              <li><a href="#"><img src="" /></a><span className="photo-tip">共4张</span></li>
            </ul>
          </section>
        </article>
      </li>
    );
  }
}
