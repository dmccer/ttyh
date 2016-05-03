import '../../less/global/layout.less';
import './index.less';

import React, {Component} from 'react';

export default class IconMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let menus = this.props.menus;

    if (!menus.length) {
      return null;
    }

    menus = menus.map((item, index) => {
      return (
        <div
          key={`icon-menu-item_${index}`}
          className="menu-item">
          <a className="menu-inner">
            <div className="icon-container">
              <img src={item.icon} />
            </div>
            <p>{item.name}</p>
          </a>
        </div>
      );
    });

    return (
      <section className="icon-menus grid">
        {menus}
      </section>
    );
  }
}
