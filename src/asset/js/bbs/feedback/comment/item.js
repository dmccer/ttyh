import './item.less';

import React from 'react';

export default class Comment extends React.Component {
  constructor() {
    super()
  }

  render() {
    // <div className="photo">
    //   <a href="#"><img src="http://img1.ph.126.net/YoeTcZOUqh9cX7nrFLk09A==/6631415211375428308.jpg" /></a>
    // </div>
    return (
      <li className="comment-item">
        <header className="row">
          <div className="profile">
            <img className="avatar" src={this.props.item.imgUrl} />
            <div className="poster">{this.props.item.userName}</div>
            <div className="post-meta">
              {
                (() => {
                  if (this.props.item.floor != null) {
                    return (<span className="floor">{this.props.item.floor}楼</span>)
                  }
                })()
              }
              <i className="icon icon-clock"></i>{new Date(this.props.item.create_time).toLocaleDateString().substring(5).replace('/', '-')}
            </div>
          </div>
          <div className="post-feedback">
            <span><i className="icon icon-praise"></i>{this.props.item.pcount}</span>
            <span><i className="icon icon-edit"></i>{this.props.item.rcount}</span>
          </div>
        </header>
        <article className="post-body">
          <section className="post-content">
            <p className="post-text">{this.props.item.content}</p>
            {
              (() => {
                if (this.props.item.replied) {
                  return (
                    <div className="replied">
                      <i className="icon icon-quote">『</i>
                      <p className="replied-content"><span className="head">回复<b>{this.props.item.replied.floor}</b>楼: </span>{this.props.item.replied.text}</p>
                    </div>
                  )
                }
              })()
            }
          </section>
        </article>
      </li>
    )
  }
}
