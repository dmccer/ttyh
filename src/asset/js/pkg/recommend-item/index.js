/**
 * 推荐货源列表项
 * 
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';
import SearchItem from '../search-item/';

export default class RecommendPkgItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="recommend-pkg-item">
        <SearchItem />
        <div className="tag unread">未读</div>
      </div>
    );
  }
}
