import './index.less';

import React, {Component, PropTypes}from 'react';
import cx from 'classnames';
import Mask from '../mask/';

export default class Selector extends Component {
  static propTypes = {
    title: PropTypes.string,
    select: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      name: PropTypes.string
    }))
  };

  state = {};

  constructor() {
    super();
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
          <li
            className={item.disabled ? 'disabled' : ''}
            key={`item_${item.id}`}
            onClick={item.disabled ? () => {} : this.select.bind(this, item)}>
            <span>{item.name}</span>
          </li>
        );
      });

      return list;
    }
  }

  render() {
    if (!this.state.on) {
      return null;
    }

    let title = this.props.title ? (
      <li className="title"><span>{this.props.title}</span></li>
    ) : null;

    return (
      <section className={cx('selector', this.props.className || '')}>
        <Mask click={this.close.bind(this)} />
        <ul className="selector-panel">
          {title}
          {this.renderItem()}
        </ul>
      </section>
    );
  }
}
