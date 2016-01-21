import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import CitySelector from '../../city-selector/';
import Selector from '../../selector/';

export default class PkgPubPage extends React.Component {

  state = $.extend({
    qs: querystring.parse(location.search.substring(1)),
    truckType: {},
  }, JSON.parse(localStorage.getItem('pkg-pub')) || {}, {
    memo: localStorage.getItem('memo')
  });

  constructor() {
    super();
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

    let r = this.validate();
    if (r !== true) {
      this.refs.poptip.warn(r);

      return;
    }

    this.refs.loading.show('发布中...');
    new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/pub_pkg',
        type: 'POST',
        data: {
          startPoint: this.state.startPoint,
          endPoint: this.state.endPoint,
          truckType: this.state.truckType,
          pkgType: this.state.pkgType,
          pkgWeight: this.state.pkgWeight,
          memo: this.state.memo
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.refs.poptip.success('发布货源成功');

      // 清空发布货源草稿及备注
      localStorage.removeItem('pkg-pub');
      localStorage.removeItem('memo');

      this.setState({
        startPoint: null,
        endPoint: null,
        truckType: {},
        pkgType: null,
        pkgWeight: null,
        memo: null
      });

      // TODO: 跳转到我的货源列表页面
    }).catch(() => {
      this.refs.poptip.error('发布货源失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  validate() {
    if ($.trim(this.state.startPoint) === '') {
      return '出发地址不能为空';
    }

    if ($.trim(this.state.endPoint) === '') {
      return '到达地址不能为空';
    }

    if ($.trim(this.state.truckType) === '') {
      return '车型不能为空';
    }

    return true;
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
  }

  showSelector(field, e) {
    this.setState({
      selectorItems: this.state[`${field}s`],
      selectorField: field
    });

    this.refs.selector.show();
  }

  handleSelectProvince(province) {
    this.setState({
      [this.state.citySelectorField]: province
    }, () => {
      this.writeDraft();
    });
  }

  handleSelectCity(city) {
    let field = this.state.citySelectorField;

    this.setState({
      [field]: `${this.state[field]}-${city}`
    }, () => {
      this.writeDraft();
    });
  }

  handleSelectArea(area) {
    let field = this.state.citySelectorField;

    this.setState({
      [field]: `${this.state[field]}-${area}`
    }, () => {
      this.writeDraft();
    });
  }

  handleSelectHistory(...args) {
    args.reverse();

    let selected = args.filter((arg) => {
      return !!arg;
    });

    this.setState({
      [this.state.citySelectorField]: selected.join('-')
    });
  }

  handleCancelCitySelector() {
    this.setState({
      showCitySelector: false
    });
  }

  handleSelectItem(item) {
    this.setState({
      [this.state.selectorField]: item
    }, () => {
      this.writeDraft();
    });
  }

  handleNumChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d\.]+/g, '')
    }, () => {
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
        <h2 className="subtitle">货车要求</h2>
        <div className="field-group">
          <div className="field">
            <label>
              <b>*</b>
              <i className="icon icon-truck-type s20"></i>
            </label>
            <div className="control">
              <input
                type="text"
                disabled="disabled"
                placeholder="选择车型"
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
          onSelectHistory={this.handleSelectHistory.bind(this)}
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
