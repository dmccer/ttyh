import '../../../../less/global/form.less';
import './add.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import ResPicker from './../../res-picker/';

export default class CommentAdd extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      text: '',
      maxCommentLen: 2000,
      postId: query.postId
    }
  }

  submit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      url: '/posts/' + this.state.postId + '/comments',
      type: 'POST',
      data: {
        text: this.state.text,
        photos: this.state.photo
      },
      success: (data) => {

      },
      error: () => {

      }
    })
  }

  handleCommentChange(e: Object) {
    let val = e.target.value;

    if (val.length > this.state.maxCommentLen) {
      val = val.substring(0, this.state.maxCommentLen);
    }

    this.setState({
      text: val
    });
  }

  handlePickRes(res: Object) {
    if (!res.emoj) {
      return this.setState(res);
    }

    this.setState({
      text: this.state.text + res.emoj.id
    })
  }

  switchResMenu(menu: string) {
    if (menu === this.state.resMenu) {
      this.setState({
        resMenu: null
      });

      return;
    }

    this.setState({
      resMenu: menu
    });
  }

  closeResPicker() {
    this.switchResMenu(this.state.resMenu);
  }

  render() {
    return (
      <section className="comment-add">
        <form className="form" onSubmit={this.submit.bind(this)}>
          <div className="control">
            <textarea
              className="comment-text"
              placeholder="这里输入评论"
              value={this.state.text}
              onChange={this.handleCommentChange.bind(this)}
              onFocus={this.closeResPicker.bind(this)}
              ></textarea>
            <span className="char-count">{this.state.text.length}/{this.state.maxCommentLen}</span>
          </div>
          <div className="control publish">
            <button className="btn teal">发布</button>
          </div>
          <div className="footer fixed">
            <ResPicker
              menus={['emoj', 'photo']}
              onPick={this.handlePickRes.bind(this)}
              on={this.state.resMenu}
              onSwitch={this.switchResMenu.bind(this)}
            />
          </div>
        </form>
      </section>
    )
  }
}

ReactDOM.render(<CommentAdd />, $('#page').get(0));
