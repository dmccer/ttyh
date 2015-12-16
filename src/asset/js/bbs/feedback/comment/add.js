import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import './add.less';

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'zepto';
import querystring from 'querystring';
import ResPicker from './../../res-picker/';
import Loading from  '../../../loading/';
import Poptip from  '../../../poptip/';

const COMMENT_ERR = {
  1: '参数有误',
  3: '话题ID有误',
  4: '帖子ID有误' ,
  5: '发布内容不能为空',
  7: '用户ID有误或被评论帖子不存在',
  8: '发布评论失败',
  9: '发布评论失败'
}

export default class CommentAdd extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      text: '',
      maxCommentLen: 200,
      qs: query
    }
  }

  submit(e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if ($.trim(this.state.text) === '') {
      this.refs.poptip.warn(COMMENT_ERR[5]);

      return;
    }

    this.refs.loading.show('发布中...');

    $.ajax({
      url: '/mvc/bbs_v2/comment',
      type: 'POST',
      data: {
        token: this.state.qs.token,
        uid: this.state.qs.uid,
        pid: this.state.qs.fid,
        content: this.state.text,
        tid: this.state.qs.tid
      },
      success: (data) => {
        this.refs.loading.close();

        if (data !== 0) {
          this.refs.poptip.warn(COMMENT_ERR[data] || '发布评论失败');

          return;
        }

        this.refs.poptip.success('发布成功');

        setTimeout(() => {
          history.back();
        }, 3000)
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
      lastEmoj: res.emoj,
      text: this.state.text + res.emoj
    })
  }

  delEmoj() {
    let text = this.state.text;
    let lastEmoj = this.state.lastEmoj;

    // 最后不是表情
    if (!lastEmoj) {
      return;
    }

    let len = lastEmoj.length;
    let newText = text.substr(0, text.length - len);
    let m = newText.match(/\[\/f[0-9]+\]$/);
    lastEmoj = m && m.length ? m[0] : null;

    this.setState({
      lastEmoj: lastEmoj,
      text: newText
    });
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
              onDelEmoj={this.delEmoj.bind(this)}
              onSwitch={this.switchResMenu.bind(this)}
            />
          </div>
        </form>
        <Loading ref='loading' />
        <Poptip ref='poptip' />
      </section>
    )
  }
}

ReactDOM.render(<CommentAdd />, $('#page').get(0));
