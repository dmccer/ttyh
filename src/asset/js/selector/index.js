import './index.less';

import React from 'react';
import cx from 'classnames';
import Mask from '../mask/';

export default class Selector extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  show() {
    this.setState({
      on: true
    });
  }

  close() {
    this.setState({
      on: false
    });
  }

  select(item) {
    this.props.select(item);

    this.close();
  }

  renderItem() {
    if (this.props.items && this.props.items.length) {
      let list = this.props.items.map((item) => {
        return (
          <li key={`item_${item.id}`} onClick={this.select.bind(this, item)}><span>{item.name}</span></li>
        );
      });

      if (list.length % 2 !== 0) {
        list.push(<li key={'item_extra'}><span></span></li>);
      }

      return list;
    }
  }

  render() {
    if (!this.state.on) {
      return null;
    }

    return (
      <section className="selector">
        <Mask click={this.close.bind(this)} />
        <ul className="selector-panel">
          {this.renderItem()}
        </ul>
      </section>
    );
  }
}
