import '../../../../less/global/form.less';
import './add.less';


import React from 'react';
import ReactDOM from 'react-dom';
import ResPicker from './../../res-picker/';

export default class CommentAdd extends React.Component {
  constructor() {
    super();

    this.state = {
      text: ''
    }
  }

  submit() {
    $.ajax({
      url: '/posts/' + postId + '/comment',
      type: 'POST',
      success: (data) => {

      },
      error: () => {

      }
    })
  }

  render() {
    return (
      <section className="comment-add">
        <form className="form" onSubmit={this.submit.bind(this)}>
          <div className="control">
            <textarea value={this.state.text} className="comment-text" placeholder="这里输入评论"></textarea>
            <span className="char-count">{this.state.text.length}/2000</span>
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
