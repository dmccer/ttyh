import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/cell.less';
import './index.less';

import React, {Component} from 'react';
import {render} from 'react-dom';

import CityFilter from '../../city-filter/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import AH from '../../helper/ajax';

const PAGE_TYPE = 'shipper_page';

export default class SpRoute extends Component {
  state = {};

  constructor() {
    super();
  }

  handleCityFilterInit(q) {
    this.setState(q, () => {
      this.query();
    });
  }

  query() {

  }

  renderItems() {
    let trucks = this.state.trucks;

    if (trucks && trucks.length) {
      return trucks.map((truck, index) => {
        return (
          <SearchItem
            verifyTip={this.handleShowVerifyTip.bind(this)}
            key={`pkg-item_${index}`}
            {...truck} />
        );
      });
    }

    return this.renderEmpty();
  }

  render() {
    return (
      <section className="sp-route-page">
        <CityFilter
          pageType={PAGE_TYPE}
          init={this.handleCityFilterInit.bind(this)}
          fixed={true}
        />
        <div className="cells spr-list">
          <div className="cell">
            <div className="cell-hd">
              <div className="spr-logo">
                <img src={'http://imgsize.ph.126.net/?imgurl=http://img0.ph.126.net/jUGiLNtdMqLtFrGu8-fPXQ==/6631212901239917475.jpg_188x188x1.jpg'} />
              </div>
            </div>
            <div className="cell-bd cell-primary">
              <div className="spr-info">
                <h2>
                  <i className="icon icon-wlcom s20"></i>
                  <span>万台物流</span>
                </h2>
                <p className="spr-description">专业调车三十年，大事件艾佛森，大事件艾的萨芬撒佛，大事件艾佛森艾佛森，大事件艾的萨芬撒佛，大事件艾佛森大事件艾佛森</p>
                <p className="spr-company">上海皮包公司</p>
              </div>
            </div>
            <div className="cell-ft">
              <a href="tel:xxx" className="icon icon-call s30"></a>
            </div>
          </div>
          <div className="cell">
            <div className="cell-hd">
              <div className="spr-logo">
                <img src={'http://imgsize.ph.126.net/?imgurl=http://img0.ph.126.net/jUGiLNtdMqLtFrGu8-fPXQ==/6631212901239917475.jpg_188x188x1.jpg'} />
              </div>
            </div>
            <div className="cell-bd cell-primary">
              <div className="spr-info">
                <h2>
                  <i className="icon icon-wlcom s20"></i>
                  <span>万打物流</span>
                </h2>
                <p className="spr-description">专业调车三十年，大事件艾佛森，大事件艾的萨芬撒佛，大事件艾佛森艾佛森，大事件艾的萨芬撒佛，大事件艾佛森大事件艾佛森</p>
                <p className="spr-company">上海啥擦圣诞节阿佛公司</p>
              </div>
            </div>
            <div className="cell-ft">
              <a href="tel:xxx" className="icon icon-call s30"></a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

render(<SpRoute />, document.querySelector('.page'));
