import '../../less/component/icon.less';
import './index.less';

import React from 'react';
import classNames from 'classnames';

export default class Avatar extends React.Component {
  constructor() {
    super();
  }

  render() {
    let avatarClassNames = classNames('avatar', this.props.size || 's40');

    if (this.props.img) {
      let style = {
        backgroundImage: `url(${this.props.img}!small)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      };

      return (
        <a href={this.props.link || 'javascript:void(0)'} className={avatarClassNames} style={style}></a>
      );
    }

    return <a href={this.props.link} className={avatarClassNames}><i className="icon icon-avatar"></i></a>
  }
}
