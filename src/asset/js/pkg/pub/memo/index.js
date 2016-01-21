/**
 * 发布货源备注填写和选择页面
 */
import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

export default class PkgPubMemoPage extends React.Component {
  state = {};

  constructor() {
    super();
  }

  componentWillMount() {
    let memo = localStorage.getItem('memo');
    let memos = [
      {
        name: '价格急走',
        id: 1
      }, {
        name: '货主在等',
        id: 2
      }, {
        name: '免过路费',
        id: 3
      }, {
        name: '一装二卸',
        id: 4
      }, {
        name: '二装二卸',
        id: 5
      }, {
        name: '今订明装',
        id: 6
      }, {
        name: '下雨也装',
        id: 7
      }, {
        name: '卸车结款',
        id: 8
      }, {
        name: '价格面议',
        id: 9
      }, {
        name: '随到随装',
        id: 10
      }
    ];

    this.setState({
      memo: memo,
      memos: memos
    });
  }

  /**
   * 提交备注
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    localStorage.setItem('memo', this.state.memo);
    history.back();
  }

  /**
   * 选择备注标签
   */
  handleSelectMemo(memo) {
    this.setState({
      memo: this.state.memo && `${this.state.memo},${memo.name}` || memo.name
    });
  }

  /**
   * 处理备注内容改变
   */
  handleStrChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value)
    }, () => {
      localStorage.setItem('memo', this.state.memo);
    });
  }

  render() {
    let list = this.state.memos.map((memo) => {
      return (
        <div
          key={`memo-item_${memo.id}`}
          className="tag"
          onClick={this.handleSelectMemo.bind(this, memo)}>{memo.name}</div>
      );
    });

    return (
      <form className="form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="control">
          <textarea
            placeholder="添加备注"
            value={this.state.memo}
            onChange={this.handleStrChange.bind(this, 'memo')}
          ></textarea>
        </div>
        <div className="memo-tag-list">
          {list}
        </div>
        <button className="btn block teal" type="submit">确定</button>
      </form>
    );
  }
}

ReactDOM.render(<PkgPubMemoPage />, $('#page').get(0));
