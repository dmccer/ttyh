import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';

export default class PkgPubMemoPage extends React.Component {
  constructor() {
    super();

    this.state = {};
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

    if (memo != null) {
      memos.forEach((item) => {
        if (memo.indexOf(item.name) !== -1) {
          item.selected = true;
        }
      });
    }

    this.setState({
      memo: memo,
      memos: memos
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    localStorage.setItem('memo', this.state.memo);

    history.back();
  }

  handleSelectMemo(memo) {
    let memos = this.state.memos;
    memo.selected = true;

    this.setState({
      memos: memos,
      memo: this.state.memo && `${this.state.memo}, ${memo.name}` || memo.name
    });
  }

  handleStrChange(field: string, e: Object) {
    let o = {};

    o[field] = $.trim(e.target.value);

    this.setState(o);
  }

  render() {
    let list = this.state.memos.map((memo) => {
      let cxs = cx('tag', memo.selected ? 'selected' : '');

      return (
        <div
          key={`memo-item_${memo.id}`}
          className={cxs}
          onClick={memo.selected ? null : this.handleSelectMemo.bind(this, memo)}>{memo.name}</div>
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
