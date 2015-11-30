import './action.less';

import React from 'react';

export default class Action extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="fb-action-panel">
        <ul className="">
          <li><i className="icon icon-edit"></i>评论</li>
          <li><i className="icon icon-praise"></i>赞</li>
        </ul>
      </div>
    )
  }
}
