/**
 * 选择车型
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 *
 */

import './select-truck-type-enhance.less';

import React, {Component} from 'react';
import keys from 'lodash/object/keys';

import Selector from '../selector/';
import Poptip from '../poptip/';
import Loading from '../loading/';
import Log from '../log/';
import $ from '../helper/z';
import AH from '../helper/ajax';
import {TruckTypes, TruckLengths} from '../truck/model/';

const TRUCK_SELECTOR_TYPE = [
  'truckType',
  'truckLength'
];

export var SelectTruckTypeEnhance = ComposedComponent => class extends Component {
  state = {
    truckType: {},
    truckLength: {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
  }

  setTruckEnhanceSelectorType(type: Number) {
    this.setState({
      sType: type
    });
  }

  setSelectTruckTypeData(o: Object) {
    this.setState(o);
  }

  /**
   * 处理选择车型和车长
   */
  handleSelectTruckType(cb: Function) {
    this.cb = typeof cb === 'function' ? cb : () => {};

    // 若已经请求过车型和车长列表，则直接展示
    if (this.state.truckTypes && this.state.truckLengths) {
      this.showSelector(TRUCK_SELECTOR_TYPE[0]);

      return;
    }

    this.ah.all([TruckTypes, TruckLengths], {
      success: res => {
        let truckTypes = res[0].truckTypeMap;
        truckTypes = keys(truckTypes).map(key => {
          return {
            name: truckTypes[key],
            id: key
          };
        });

        let truckLengths = res[1].truckLengthList;
        truckLengths = truckLengths.map(len => {
          return {
            name: len !== '自定义' ? `${len}米` : len,
            id: len
          };
        });

        this.setState({
          truckTypes: truckTypes,
          truckLengths: truckLengths
        }, () => {
          this.showSelector(TRUCK_SELECTOR_TYPE[0]);
        });
      },
      error: err => {
        Log.error(err);
        this.refs.poptip.warn('获取车型或车长列表失败,请重新打开页面');
      }
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

    if (field === 'truckLength' && item.id === '自定义') {
      let val = prompt('请输入车长');
      val = $.trim(val).replace(/[^\d\.]/g, '');

      if (val === '') {
        this.refs.poptip.warn('车长不能为空');
        return;
      }

      item = {
        name: `${val}米`,
        id: val
      };
    }

    this.setState({
      [this.state.selectorField]: item
    }, this.cb);

    let sType = this.state.sType;
    if (sType != null && sType === 0) {
      return;
    }

    if (field === TRUCK_SELECTOR_TYPE[0]) {
      this.showSelector(TRUCK_SELECTOR_TYPE[1]);
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
          setTruckEnhanceSelectorType={this.setTruckEnhanceSelectorType.bind(this)}
          setSelectTruckTypeData={this.setSelectTruckTypeData.bind(this)}
        />
        <Selector
          ref="selector"
          className="select-truck-type"
          items={this.state.selectorItems}
          select={this.handleSelectItem.bind(this)} />
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </div>
    );
  }
}
