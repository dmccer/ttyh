import './index.less';

import React from 'react';
import classNames from 'classnames';
import querystring from 'querystring';

export default class Avatar extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  render() {
    let qs = querystring.stringify($.extend({}, this.state.qs, {
      tuid: this.props.uid,
      title: this.props.name
    }));

    let userPostUrl = this.state.qs.tuid
      ? 'javascript:void(0)'
      : ('./user-posts.html?' + qs);

    let avatar = this.props.url
      ? <img src={this.props.url} />
      : <i className="icon icon-avatar"></i>;

    let avatarClassNames = classNames('avatar', this.props.size || 's40');

    return (
      <a href={userPostUrl} className={avatarClassNames}>{avatar}</a>
    );
  }
}
