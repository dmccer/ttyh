import './index.less';

import React from 'react';
import classNames from 'classnames';
import querystring from 'querystring';
import assign from 'lodash/object/assign';

export default class Avatar extends React.Component {
  constructor() {
    super();

    this.state = {
      qs: querystring.parse(location.search.substring(1))
    }
  }

  render() {
    let qs = querystring.stringify(assign({}, this.state.qs, {
      tuid: this.props.uid,
      title: this.props.name
    }));

    let userPostUrl = this.state.qs.tuid
      ? 'javascript:void(0)'
      : ('./user-posts.html?' + qs);

    let avatarClassNames = classNames('avatar', this.props.size || 's40');

    if (this.props.url) {
      let style = {
        backgroundImage: `url(${this.props.url}!small)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      };

      return (
        <a href={userPostUrl} className={avatarClassNames} style={style}></a>
      );
    } else {
      return <a href={userPostUrl} className={avatarClassNames}><i className="icon icon-avatar"></i></a>
    }

  }
}
