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
import Selector from '../../selector/';

export default class PkgPubPage extends React.Component {
  constructor() {
    super();

    let query = querystring.parse(location.search.substring(1));

    this.state = $.extend({
      qs: query,
      truckType: {},
      pkgType: {}
    }, JSON.parse(localStorage.getItem('pkg-pub')) || {}, {
      memo: localStorage.getItem('memo')
    });
  }

  componentWillMount() {
    let truckTypes = [
      {
        name: '平板',
        id: 1
      }, {
        name: '高栏',
        id: 2
      }, {
        name: '厢式',
        id: 3
      }, {
        name: '面包车',
        id: 4
      }, {
        name: '保温',
        id: 5
      }, {
        name: '冷藏',
        id: 6
      }, {
        name: '危险品',
        id: 7
      }, {
        name: '集装箱',
        id: 8
      }, {
        name: '其他',
        id: 9
      }
    ];

    let pkgTypes = [
      {
        name: '6.2 米',
        id: 1
      }, {
        name: '5 米',
        id: 2
      }, {
        name: '3.2 米',
        id: 3
      }, {
        name: '4.2 米',
        id: 4
      }, {
        name: '7.2 米',
        id: 5
      }, {
        name: '14.2 米',
        id: 6
      }, {
        name: '其他',
        id: 7
      }
    ];

    this.setState({
      truckTypes: truckTypes,
      pkgTypes: pkgTypes
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    // TODO:
    // 提交服务器
  }

  writeDraft() {
    localStorage.setItem('pkg-pub', JSON.stringify({
      truckType: this.state.truckType,
      pkgType: this.state.pkgType,
      startPoint: this.state.startPoint,
      endPoint: this.state.endPoint,
      pkgWeight: this.state.pkgWeight
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

  renderMemo() {
    if (this.state.memo) {
      return (
        <a href="./pkg-pub-memo.html" className="input-holder on">{this.state.memo}</a>
      );
    }

    return (
      <a href="./pkg-pub-memo.html" className="input-holder">备注</a>
    );
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
                onClick={this.showSelector.bind(this, 'truckType')}
                value={this.state.truckType.name} />
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
                onClick={this.showSelector.bind(this, 'pkgType')}
                value={this.state.pkgType.name} />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-pkg-weight s20"></i></label>
            <div className="control">
              <input
                type="text"
                placeholder="货重"
                value={this.state.pkgWeight}
                onChange={this.handleNumChange.bind(this, 'pkgWeight')}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><i className="icon icon-memo s20"></i></label>
            <div className="control">
              {this.renderMemo()}
              <i className="icon icon-arrow"></i>
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
        <Selector
          ref="selector"
          items={this.state.selectorItems}
          select={this.handleSelectItem.bind(this)} />
      </section>
    );
  }
}

ReactDOM.render(<PkgPubPage />, $('#page').get(0));
