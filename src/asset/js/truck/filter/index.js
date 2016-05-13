import '../../../less/global/global.less';
import '../../../less/global/form.less';
import '../../../less/global/layout.less';
import './index.less';

import React, {Component} from 'react';
import cx from 'classnames';
import querystring from 'querystring';
import keys from 'lodash/object/keys';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';
import findIndex from 'lodash/array/findIndex';
import ReactIScroll from 'react-iscroll';
import IScroll from 'iscroll/build/iscroll';

import AH from '../../helper/ajax';
import $ from '../../helper/z';
// import {
//   TruckTypes,
//   TruckSearchLengths,
//   TruckLoadLimits
// } from '../model/';
import {
  OrderedEnumValue
} from '../../model/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';

const SEARCH_FILTER_SUFFIX = '_search_filter';

export default class SearchFilter extends Component {
  static defaultProps = {
    options: {
      mouseWheel: true,
      scrollbars: true
    },
    on: false,
    top: 0,
    onCancel() {},
    onShow() {},
    onClose() {},
    done() {}
  };

  state = {
    qs: querystring.parse(location.search.substring(1)),
    // truckTypes: [],
    selectedTruckTypes: [],
    selectedLoadLimits: [],
    selectedTruckLengths: [],
    selectedUseTypes: []
  };

  constructor() {
    super();
  }

  transform(m) {
    return m.map(item => {
      return {
        name: item.value,
        id: item.key
      };
    });
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    let pageType = this.props.pageType;

    if (!pageType) {
      throw new Error('缺少页面类型参数');
    }

    this.ah.all([OrderedEnumValue, OrderedEnumValue, OrderedEnumValue, OrderedEnumValue], {
      success: (res) => {
        let selected = JSON.parse(localStorage.getItem(`${pageType}${SEARCH_FILTER_SUFFIX}`)) || {};

        this.setState(assign({}, selected, {
          truckTypes: this.transform(res[0].truckTypeMap),
          truckLengths: this.transform(res[1].searchLengthMap),
          loadLimits: this.transform(res[2].loadLimitMap),
          useTypes: this.transform(res[3].useTypeMap)
        }));
      },
      error: () => {
        this.refs.poptip.warn('获取车型、载重、车长失败, 请重试');
      }
    }, ['truckType'], ['searchLength'], ['loadLimit'], ['useType']);
  }

  // renderTruckTypeList() {
  //   if (this.state.truckTypes && this.state.truckTypes.length) {
  //     return this.state.truckTypes.map((truckType) => {
  //       let has = find(this.state.selectedTruckTypes, (selectedTruckType) => {
  //         return selectedTruckType.id === truckType.id;
  //       });
  //
  //       return (
  //         <li key={`truck-type_${truckType.id}`} className={has ? 'on' : ''}>
  //           <a href="javascript:void(0)" onTouchTap={this.handleSelectItem.bind(this, 'selectedTruckTypes', truckType)}>
  //             <span>{truckType.name}</span>
  //             <i className="icon icon-right"></i>
  //           </a>
  //         </li>
  //       );
  //     });
  //   }
  // }

  renderTagList(listField, selectedField) {
    let list = this.state[listField];

    if (list && list.length) {
      return list.map((item) => {
        let has = find(this.state[selectedField], (_item) => {
          return _item.id === item.id
        });

        return (
          <li key={`${listField}_${item.id}`} className={has ? 'on' : ''}>
            <a href="javascript:void(0)" onTouchTap={this.handleSelectItem.bind(this, selectedField, item)}>
              <span>{item.name}</span>
              <i className="icon icon-right"></i>
            </a>
          </li>
        );
      });
    }
  }

  // renderLoadlimitList() {
  //   let list = this.state.loadLimits;
  //
  //   if (list && list.length) {
  //     return list.map((item) => {
  //       let has = find(this.state.selectedLoadLimits, (loadLimit) => {
  //         return loadLimit.id === item.id;
  //       });
  //
  //       return (
  //         <li key={`truck-type_${item.id}`} className={has ? 'on' : ''}>
  //           <a href="javascript:void(0)" onTouchTap={this.handleSelectItem.bind(this, 'selectedLoadLimits', item)}>
  //             <span>{item.name}</span>
  //             <i className="icon icon-right"></i>
  //           </a>
  //         </li>
  //       );
  //     });
  //   }
  // }
  //
  // renderTruckLengthList() {
  //   let list = this.state.truckLengths;
  //
  //   if (list && list.length) {
  //     return list.map((item) => {
  //       let has = find(this.state.selectedTruckLengths, (truckLength) => {
  //         return truckLength.id === item.id;
  //       });
  //
  //       return (
  //         <li key={`truck-type_${item.id}`} className={has ? 'on' : ''}>
  //           <a href="javascript:void(0)" onTouchTap={this.handleSelectItem.bind(this, 'selectedTruckLengths', item)}>
  //             <span>{item.name}</span>
  //             <i className="icon icon-right"></i>
  //           </a>
  //         </li>
  //       );
  //     });
  //   }
  // }

  handleSelectItem(field, item) {
    let selected = this.state[field];

    let index = findIndex(selected , (s) => {
      return s.id === item.id
    });

    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }

    this.setState({
      [field]: selected
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    let pageType = this.props.pageType;

    let d = {
      selectedLoadLimits: this.state.selectedLoadLimits,
      selectedTruckTypes: this.state.selectedTruckTypes,
      selectedTruckLengths: this.state.selectedTruckLengths
    };

    localStorage.setItem(`${pageType}${SEARCH_FILTER_SUFFIX}`, JSON.stringify(d));

    this.props.close();
    this.props.done(d);
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      selectedTruckTypes: [],
      selectedLoadLimits: [],
      selectedTruckLengths: []
    });

    localStorage.removeItem(`${this.props.pageType}${SEARCH_FILTER_SUFFIX}`);
  }

  render() {
    let winH = $.height(window);
    let top = this.props.top;
    let height = winH - top;

    if (height < 292) {
      top = 0;
      height = winH;
    }

    let scrollerHeight = height - 100;
    let cxs = cx('conditon-filter', this.props.on ? 'on' : '');

    return (
      <section
        className={cxs}
        style={{
          height: `${height}px`,
          top: `${top}px`
        }}
        onClick={this.props.cancel}
        >
        <div className="inner">
          <div
            className="filter-category-list"
            style={{
              height: `${scrollerHeight}px`
            }}>
            <ReactIScroll
              iScroll={IScroll}
              options={this.props.options}>
              <div className="scroller">
                <h2 className="subtitle">是否整车</h2>
                <ul className="tag-list">
                  {this.renderTagList('useTypes', 'selectedUseTypes')}
                </ul>
                <h2 className="subtitle">车型</h2>
                <ul className="tag-list">
                  {this.renderTagList('truckTypes', 'selectedTruckTypes')}
                </ul>
                <h2 className="subtitle">载重</h2>
                <ul className="tag-list">
                  {this.renderTagList('loadLimits', 'selectedLoadLimits')}
                </ul>
                <h2 className="subtitle">车长</h2>
                <ul className="tag-list">
                  {this.renderTagList('truckLengths', 'selectedTruckLengths')}
                </ul>
              </div>
            </ReactIScroll>
          </div>
          <div className="actions row">
            <div className="clear-btn">
              <div className="btn offWhite line block" onClick={this.clear.bind(this)}>清空</div>
            </div>
            <div>
              <div className="btn teal block" onClick={this.handleSubmit.bind(this)}>确定</div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
