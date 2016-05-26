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
import {
  OrderedEnumValue
} from '../../model/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';

const SEARCH_FILTER_SUFFIX = '_search_filter';
const FILTERS = [{
  k: 'useTypes',
  s: 'selectedUseTypes',
  name: '是否整车'
}, {
  k: 'truckTypes',
  s: 'selectedTruckTypes',
  name: '车型'
}, {
  k: 'loadLimits',
  s: 'selectedLoadLimits',
  name: '载重'
}, {
  k: 'truckLengths',
  s: 'selectedTruckLengths',
  name: '车长'
}];

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
        this.refs.poptip.warn('获取车型、载重、车长、用车方式失败, 请重试');
      }
    }, ['truckType'], ['searchLength'], ['loadLimit'], ['useType']);
  }

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

  handleSelectItem(field, item) {
    let selected = this.state[field];

    console.log(field, item)

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
      selectedUseTypes: this.state.selectedUseTypes,
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
      selectedUseTypes: [],
      selectedTruckTypes: [],
      selectedLoadLimits: [],
      selectedTruckLengths: []
    });

    localStorage.removeItem(`${this.props.pageType}${SEARCH_FILTER_SUFFIX}`);
  }

  hasFilter(f) {
    let filters = this.props.filters;

    if (!filters|| !filters.length) {
      return false;
    }

    return filters.indexOf(f) !== -1;
  }

  renderFilters() {
    let list = [];

    FILTERS.forEach((f, index) => {
      if (this.hasFilter(f.k)) {
        list.push((
          <div key={`f_item_${index}`}>
            <h2 className="subtitle">{f.name}</h2>
            <ul className="tag-list">
              {this.renderTagList(f.k, f.s)}
            </ul>
          </div>
        ));
      }
    });

    return list;
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
                {this.renderFilters()}
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
