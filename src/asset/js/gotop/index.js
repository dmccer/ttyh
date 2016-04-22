import './index.less';

import React from 'react';
import cx from 'classnames';
import debounce from 'lodash/function/debounce';
import $ from '../helper/z';
import EventListener from 'fbjs/lib/EventListener';

export default class GoTop extends React.Component {
  state = {};

  constructor() {
    super();
  }

  componentDidMount() {
    let winH = $.height(window);

    EventListener.listen(window, 'scroll', debounce(() => {
      let t = $.scrollTop(window);
      let on = t > 1.5 * winH;

      this.setState({
        on: on
      });
    }));
  }

  back() {
    $.scrollTop(window, 0);
  }

  render() {
      return this.state.on ? <div className="go-top" onClick={this.back.bind(this)}>顶部</div> : null;
  }
}
