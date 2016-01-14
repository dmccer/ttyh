import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';

export default class TruckPubPage extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = $.extend({
      qs: query,
      memoMaxLength: 80
    }, JSON.parse(localStorage.getItem('truck-pub')) || {}, {
      memo: localStorage.getItem('memo') || ''
    });
  }

  componentWillMount() {
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO:
    // 提交服务器
  }

  writeDraft() {
    localStorage.setItem('truck-pub', JSON.stringify({
      startPoint: this.state.startPoint,
      endPoint: this.state.endPoint
    }));
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

  showSelector(field, e) {
    this.setState({
      selectorItems: this.state[`${field}s`],
      selectorField: field
    });

    this.refs.selector.show();
  }

  handleSelectProvince(province) {
    let d = {};
    d[this.state.citySelectorField] = province;

    this.setState(d, () => {
      this.writeDraft();
    });
  }

  handleSelectCity(city) {
    let d = {};
    let field = this.state.citySelectorField;

    d[field] = `${this.state[field]}-${city}`;

    this.setState(d, () => {
      this.writeDraft();
    });
  }

  handleSelectArea(area) {
    let d = {};
    let field = this.state.citySelectorField;

    d[field] = `${this.state[field]}-${area}`;

    this.setState(d, () => {
      this.writeDraft();
    });
  }

  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  handleSelectItem(item) {
    let d = {};

    d[this.state.selectorField] = item;
    this.setState(d, () => {
      this.writeDraft();
    });
  }

  handleNumChange(field: string, e: Object) {
    let o = {};

    o[field] = $.trim(e.target.value).replace(/[^\d\.]+/g, '');

    this.setState(o, () => {
      this.writeDraft();
    });
  }

  handleStrChange(field: string, e: Object) {
    let o = {};
    o[field] = $.trim(e.target.value);

    this.setState(o);
  }

  render() {
    return (
      <section className="truck-pub">
        <div className="row biz-types">
          <label>
            <input type="checkbox" />
            回头车
          </label>
          <label>
            <input type="checkbox" />
            顺风车
          </label>
          <label>
            <input type="checkbox" />
            专线
          </label>
        </div>
        <h2 className="subtitle"><b>*</b>路线</h2>
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
            <label></label>
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
        <h2 className="subtitle"><b>*</b>选择车辆</h2>
        <ul className="truck-list">
          <li>
            <a href="#">
              <h3>吉祥</h3>
              <p>AU8998 厢式 3.3米 2吨</p>
              <i className="icon icon-arrow"></i>
            </a>
          </li>
        </ul>
        <h2 className="subtitle"><b>*</b>备注</h2>
        <div className="field-group">
          <div className="field memo">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              <textarea
                placeholder="备注"
                value={this.state.memo}
                onChange={this.handleStrChange.bind(this, 'memo')}
              ></textarea>
              <span className="char-count">{this.state.memo.length}/{this.state.memoMaxLength}</span>
            </div>
          </div>
        </div>
        <button
          className="btn block teal pub-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >发布</button>
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

ReactDOM.render(<TruckPubPage />, $('#page').get(0));
