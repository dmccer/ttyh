/**
 * 发布货源备注填写和选择页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';

const MEMO = 'pkg-pub-memo';

export default class PkgPubMemoPage extends React.Component {
  state = {
    memos: [],
    memoMaxLength: 80
  };

  constructor() {
    super();
  }

  componentDidMount() {
    new Promise((resolve, reject) => {
      this.refs.loading.show('加载中...');

      $.ajax({
        url: '/mvc/v2/getProductMemo',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    })
    .then((res) => {
      let memo = localStorage.getItem(MEMO);
      let memos = res.productMemoList.map((memo) => {
        return {
          name: memo,
          id: memo
        };
      });

      this.setState({
        memo: memo,
        memos: memos
      });
    })
    .catch(() => {
      this.refs.poptip.warn('加载备注列表失败,请重试');
    })
    .done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 处理备注改变
   * @param  {ChangeEvent} e
   */
  handleMemoChange(e: Object) {
    let val = $.trim(e.target.value);

    if (val.length > this.state.memoMaxLength) {
      this.refs.poptip.warn('只能输入80个字符');

      val = val.substring(0, this.state.memoMaxLength);
    }

    this.setState({
      memo: val
    }, () => {
      localStorage.setItem('memo', this.state.memo);
    });
  }

  /**
   * 提交备注
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    localStorage.setItem(MEMO, this.state.memo || '');
    history.back();
  }

  /**
   * 选择备注标签
   */
  handleSelectMemo(memo) {
    let s = this.state.memo && `${this.state.memo},${memo.name}` || memo.name;

    if (s.length > this.state.memoMaxLength) {
      this.refs.poptip.warn('只能输入80个字符');
      return;
    }

    this.setState({
      memo: s
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
            onChange={this.handleMemoChange.bind(this)}
          ></textarea>
        </div>
        <div className="memo-tag-list">
          {list}
        </div>
        <button className="btn block teal" type="submit">确定</button>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </form>
    );
  }
}

ReactDOM.render(<PkgPubMemoPage />, $('#page').get(0));
