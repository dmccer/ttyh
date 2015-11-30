import './add.less';

import React from 'react';
import ReactDOM from 'react-dom';

export default class CommentAdd extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="comment-add">
        <form className="form">
          <div className="control textarea">
            <textarea refs="textarea">这里输入评论</textarea>
            <span className="char-count">0/2000</span>
          </div>
          <div className="control">
            <button className="btn btn-teal">发布</button>
          </div>
          <div className="comment-img-picker">
            <ul className="img-types">
              <li><a href="#emoj">表情</a></li>
              <li><a href="#photo">图片</a></li>
            </ul>
            <ul className="img-pick-panel hide">
              <li className="emoj"></li>
              <li className="photo"></li>
            </ul>
          </div>
        </form>
      </section>
    )
  }
}

ReactDOM.render(<CommentAdd />, $('#page').get(0));
