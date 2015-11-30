import '../../../../less/global/form.less';
import './add.less';


import React from 'react';
import ReactDOM from 'react-dom';
import ResPicker from './../../res-picker/';

export default class CommentAdd extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="comment-add">
        <form className="form">
          <div className="control">
            <textarea refs="textarea" className="comment-text" placeholder="这里输入评论"></textarea>
            <span className="char-count">0/2000</span>
          </div>
          <div className="control publish">
            <button className="btn teal">发布</button>
          </div>
          <ResPicker />
        </form>
      </section>
    )
  }
}

ReactDOM.render(<CommentAdd />, $('#page').get(0));
