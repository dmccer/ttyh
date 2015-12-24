import './index.less';

import React from 'react';
import cx from 'classnames';
import fnu from 'lodash-fn';

export default class GoTop extends React.Component {
  constructor() {
    super();

    this.state = {}
  }

  componentDidMount() {
    let winH = $(window).height();

    $(window).on('scroll', fnu.debounce(() => {
      let t = $(window).scrollTop();
      let on = t > 1.5 * winH;

      this.setState({
        on: on
      });
    }));
  }

  back() {
    $(window).scrollTop(0);
  }

  render() {
      return this.state.on ? <div className="go-top" onClick={this.back.bind(this)}>顶部</div> : null;
  }
}
