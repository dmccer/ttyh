import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/cell.less';
import './index.less';

import React, {Component} from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import assign from 'lodash/object/assign';

import LoadMore from '../../load-more/';
import CityFilter from '../../city-filter/';
import Loading from '../../loading/';
import Poptip from '../../poptip/';
import AH from '../../helper/ajax';
import truckPNG from '../../../img/app/truck@3x.png';

import {SpRoutes} from '../model/';

const PAGE_TYPE = 'shipper_page';

injectTapEventPlugin();

export default class SpRoute extends Component {
  state = {
    pageIndex: 0,
    pageSize: 20,
    trucks: []
  };

  handleCityFilterInit(q) {
    this.setState(assign({
      filterLoaded: true
    }, q), () => {
      this.ah = new AH(this.refs.loading, this.refs.poptip);

      LoadMore.init(() => {
        if (!this.state.over) {
          this.query();
        }
      });

      this.query();
    });
  }

  query() {
    this.ah.one(SpRoutes, {
      success: (res) => {
        this.setState({
          loaded: true
        });

        let spRoutes = this.state.spRoutes || [];

        if (!res.speCompanyList || !res.speCompanyList.length) {
          if (!spRoutes.length) {
            return;
          }

          this.refs.poptip.info('没有更多了');

          this.setState({
            over: true
          });

          return;
        }

        spRoutes = spRoutes.concat(res.speCompanyList);

        this.setState({
          spRoutes: spRoutes,
          pageIndex: this.state.pageIndex + 1
        });
      },
      error: (err) => {
        this.refs.poptip.warn('查询专线失败,请重试');
      }
    }, {
      fromCity: this.state.fromCity,
      toCity: this.state.toCity,
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex
    });
  }

  renderItems() {
    let spRoutes = this.state.spRoutes;

    if (spRoutes && spRoutes.length) {
      let list = spRoutes.map((spRoute, index) => {
        return (
          <div className="cell" href={spRoute.introduceUrl} key={`sp-route-item_${index}`}>
            <div className="cell-hd">
              <div className="spr-logo">
                <img src={spRoute.imgUrl || 'http://imgsize.ph.126.net/?imgurl=http://img0.ph.126.net/jUGiLNtdMqLtFrGu8-fPXQ==/6631212901239917475.jpg_188x188x1.jpg'} />
              </div>
            </div>
            <div className="cell-bd cell-primary">
              <div className="spr-info">
                <h2>
                  <i className="icon icon-wlcom s20"></i>
                  <span>{spRoute.companyName}</span>
                </h2>
                <p className="spr-description">{spRoute.memo}</p>
                <p className="spr-company">{spRoute.companyAddr}</p>
              </div>
            </div>
            <div className="cell-ft">
              <a href={`tel:${spRoute.phoneNo}`} className="icon icon-call s30"></a>
            </div>
          </div>
        );
      });

      return (
        <div className="cells spr-list">{list}</div>
      );
    }

    return this.renderEmpty();
  }

  renderEmpty() {
    if (!this.state.spRoutes || !this.state.spRoutes.length && this.state.loaded) {
      return (
        <div className="empty-tip">
          <div className="img-tip">
            <img src={truckPNG} />
          </div>
          <p>未找到专线公司</p>
        </div>
      );
    }
  }

  render() {
    let list = this.state.filterLoaded ? this.renderItems() : null;

    return (
      <section className="sp-route-page">
        <CityFilter
          pageType={PAGE_TYPE}
          init={this.handleCityFilterInit.bind(this)}
          fixed={true}
        />
        {list}
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

render(<SpRoute />, document.querySelector('.page'));
