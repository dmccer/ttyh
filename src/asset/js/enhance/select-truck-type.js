/**
 * 选择车型
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 */
import React, {Component} from 'react';
import Promise from 'promise';
import Selector from '../selector/';
import Poptip from '../poptip/';
import Loading from '../loading/';

export var SelectTruckTypeEnhance = ComposedComponent => class extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  /**
   * 获取车型列表
   * @return {Promise}
   */
  fetchTruckTypes() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckType',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckTypes = res.truckTypeMap;
      truckTypes = Object.keys(truckTypes).map((key) => {
        return {
          name: truckTypes[key],
          id: key
        };
      });

      return truckTypes;
    });
  }

  /**
   * 获取车长列表
   * @return {Promise}
   */
  fetchTruckLengths() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/mvc/v2/getTruckLength',
        type: 'GET',
        cache: false,
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckLengths = res.truckLengthList;
      truckLengths = truckLengths.map((len) => {
        return {
          name: len !== '其他' ? `${len}米` : len,
          id: len
        };
      });

      return truckLengths;
    });
  }

  /**
   * 处理选择车型和车长
   */
  handleSelectTruckType(cb: Function) {
    this.cb = typeof cb === 'function' ? cb : () => {};

    // 若已经请求过车型和车长列表，则直接展示
    if (this.state.truckTypes && this.state.truckLengths) {
      this.showSelector('truckType');

      return;
    }

    this.refs.loading.show('加载中...');

    Promise
      .all([this.fetchTruckTypes(), this.fetchTruckLengths()])
      .then((res) => {
        this.setState({
          truckTypes: res[0],
          truckLengths: res[1]
        }, () => {
          this.showSelector('truckType');
        });
      })
      .catch((err) => {
        Log.error(err);

        this.refs.poptip.warn('获取车型或车长列表失败,请重新打开页面');
      })
      .done(() => {
        this.refs.loading.close();
      });
  }

  /**
   * 展示车型或车长选择面板
   * @param  {String} field 字段名，truckType 或 truckLength
   */
  showSelector(field) {
    this.setState({
      selectorItems: this.state[`${field}s`],
      selectorField: field
    }, () => {
      this.refs.selector.show();
    });
  }

  /**
   * 选中车型或车长后存入本地
   * 选中车型后再展示选则车长
   */
  handleSelectItem(item) {
    let field = this.state.selectorField;

    if (field === 'truckLength' && item.id === '其他') {
      let val = prompt('请输入车长');
      val = $.trim(val).replace(/[^\d\.]/g, '');

      item = {
        name: val,
        id: val
      };
    }

    this.setState({
      [this.state.selectorField]: item
    }, this.cb);

    if (field === 'truckType') {
      this.showSelector('truckLength');
    }
  }

  render() {
    return (
      <div className="select-truck-type-enhance">
        <ComposedComponent
          {...this.props}
          truckType={this.state.truckType}
          truckLength={this.state.truckLength}
          handleSelectTruckType={this.handleSelectTruckType.bind(this)}
        />
        <Selector
          ref="selector"
          items={this.state.selectorItems}
          select={this.handleSelectItem.bind(this)} />
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}
