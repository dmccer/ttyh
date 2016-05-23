import './index.less';

import React, {Component, PropTypes} from 'react';
import Mask from '../../mask/';

export default class PkgMaluationPanel extends Component {
  static defaultProps = {
    onSelected() {},
    items: []
  };

  static propTypes = {
    onSelected: PropTypes.func,
    items: PropTypes.array.isRequired
  }

  state = {};

  constructor(props) {
    super(props);
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

  handleSelect(item) {
    this.close();

    this.props.onSelected(item);
  }

  render() {
    if (!this.state.on) {
      return null;
    }

    let list = (this.props.items || []).map((item, index) => {
      return (
        <li
          key={`maluation-item_${index}`}
          onClick={this.handleSelect.bind(this, item)}>{item.name}</li>
      );
    });

    return (
      <section className="pkg-maluation-panel">
        <Mask type="black" click={this.close.bind(this)} />
        <section className="pkg-maluation">
          <i className="panel-close" onClick={this.close.bind(this)}>X</i>
          <h2 className="panel-title">请为本货源作出评价</h2>
          <ul className="maluation-list">
            {list}
          </ul>
          <div className="panel-footer">
            <a href={`./report.html?tel=${this.props.tel}&tid=${this.props.targetId}`}>去举报此人 &gt;</a>
          </div>
        </section>
      </section>
    );
  }
}
