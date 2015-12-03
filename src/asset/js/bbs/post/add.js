import '../../../less/global/form.less';
import './add.less';

import React from 'react';
import ReactDOM from 'react-dom';

import ResPicker from '../res-picker/';
import TipBox from '../tipbox/';

export default class PostAdd extends React.Component {
  constructor() {
    super();

    this.state = {
      title: '',
      text: '',
      maxTitleLen: 20,
      maxTextLen: 2000,
      submited: false
    }
  }

  submit(e) {
    e.preventDefault();

    $.ajax({
      url: '/posts',
      type: 'POST',
      data: {
        title: this.state.title,
        text: this.state.text
      },
      success: (data) => {
        this.setState({
          submited: true,
          submitOk: true,
          submitMsg: '发布成功'
        });
      },
      error: () => {
        this.setState({
          submited: true,
          submitOk: false,
          submitMsg: '发布失败'
        });
      }
    })
  }

  handleTitleChange(e) {
    let val = e.target.value;

    if (val.length > this.state.maxTitleLen) {
      val = val.substring(0, this.state.maxTitleLen);
    }

    this.setState({
      title: val
    })
  }

  handleTextChange(e) {
    let val = e.target.value;

    if (val.length > this.state.maxTextLen) {
      val = val.substring(0, this.state.maxTextLen);
    }

    this.setState({
      text: val
    });
  }

  handleTipBoxClosed() {
    if (this.state.submitOk) {
      location.href = location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, '/bbs.html');

      return;
    }

    this.setState({
      submited: false
    });
  }

  render() {
    return (
      <section className="post-add">
        <form className="form" onSubmit={this.submit.bind(this)}>
          <div className="control post-title">
            <input
              type="text"
              placeholder="标题"
              value={this.state.title}
              onChange={this.handleTitleChange.bind(this)}
            />
            <span className="char-count">{this.state.title.length}/20</span>
          </div>
          <div className="post-body">
            <div className="control">
              <textarea
                className="post-text"
                placeholder="正文"
                value={this.state.text}
                onChange={this.handleTextChange.bind(this)}
              ></textarea>
              <span className="char-count">{this.state.text.length}/2000</span>
            </div>
            <div className="control publish">
              <button className="btn teal">发布</button>
            </div>
          </div>
          <ResPicker />
        </form>
        {
          (() => {
            if (this.state.submited) {
              return <TipBox msg={this.state.submitMsg} ok={this.state.submitOk} onClose={this.handleTipBoxClosed.bind(this)} />
            }
          })()
        }
      </section>
    )
  }
}

ReactDOM.render(<PostAdd />, $('#page').get(0));
