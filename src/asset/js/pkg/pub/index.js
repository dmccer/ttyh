import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';

export default class PkgPubPage extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = {
      qs: query
    };
  }

  toggleCitySelector(field, e) {
    let offset = $(e.target).offset();
    let top = offset.top + offset.height;

    this.setState({
      citySelectorTop: top,
      citySelectorField: field,
      showCitySelector: true
    });

    this.forceUpdate();
  }

  handleSelectProvince(province) {
    let d = {};
    d[this.state.citySelectorField] = province;

    this.setState(d);
  }

  handleSelectCity(city) {
    let d = {};
    let field = this.state.citySelectorField;

    d[field] = `${this.state[field]}-${city}`;

    this.setState(d);
  }

  handleSelectArea(area) {
    let d = {};
    let field = this.state.citySelectorField;

    d[field] = `${this.state[field]}-${area}`;

    this.setState(d);
  }

  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  render() {
    return (
      <section className="pkg-pub">
        <h2 className="subtitle"><b>*</b>地址信息</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-start-point s20"></i></label>
            <div
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'startPoint')}>
              <input
                type="text"
                disabled="disabled"
                placeholder="请选择出发地址"
                value={this.state.startPoint} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-end-point s20"></i></label>
            <div
              className="control"
              onClick={this.toggleCitySelector.bind(this, 'endPoint')}>
              <input
                type="text"
                disabled="disabled"
                placeholder="请选择到达地址"
                value={this.state.endPoint} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <h2 className="subtitle"><b>*</b>货车要求</h2>
        <div className="field-group">
          <div className="field">
            <label><i className="icon icon-truck-type s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                placeholder="所有车型"
                value={this.state.truckType} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-type s20"></i></label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                placeholder="货物种类"
                value={this.state.pkgType} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-weight s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货重"
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <a href="./pkg-pub-memo.html" className="input-holder">备注</a>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
        </div>
        <button className="btn block teal pub-btn" type="submit">发布</button>
        <div className="fixed-holder"></div>
        <Loading ref="loading" />
        <Poptip ref="poptip" />
        <CitySelector
          on={this.state.showCitySelector}
          top={this.state.citySelectorTop}
          onSelectProvince={this.handleSelectProvince.bind(this)}
          onSelectCity={this.handleSelectCity.bind(this)}
          onSelectArea={this.handleSelectArea.bind(this)}
          onCancel={this.handleCancelCitySelector.bind(this)}
        />
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, $('#page').get(0));
