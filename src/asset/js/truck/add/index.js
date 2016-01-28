/**
 * 添加车辆页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/icon.less';

import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';

import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Selector from '../../selector/';
import Log from '../../log/';
import {FieldChangeEnhance} from '../../enhance/field-change';

@FieldChangeEnhance
export default class TruckAddPage extends React.Component {
  state = {
    truckType: {},
    truckLength: {}
  };

  constructor() {
    super();
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
        success: resolve,
        error: reject
      });
    }).then((res) => {
      let truckLengths = res.truckLengthList;
      truckLengths = truckLengths.map((len) => {
        return {
          name: len,
          id: len
        };
      });

      return truckLengths;
    });
  }

  /**
   * 处理选择车型和车长
   */
  handleSelectTruckType() {
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

    this.setState({
      [this.state.selectorField]: item
    }, () => {
      // this.writeDraft();
    });

    if (field === 'truckType') {
      this.showSelector('truckLength');
    }
  }

  /**
   * 提交车辆
   * @param  {ClickEvent} e
   */
  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    let validate_msg = this.validate();

    if (validate_msg !== true) {
      this.refs.poptip.warn(validate_msg);

      return;
    }

    this.refs.loading.show('请求中...');

    new Promise((resolve, reject) => {
      let props = this.props;

      $.ajax({
        url: '/mvc/v2/insertTruck',
        type: 'POST',
        data: {
          dirverName: props.name,
          dirverPoneNo: props.tel,
          licensePlate: props.license,
          loadLimit: props.weight,
          truckType: this.state.truckType.id,
          truckLength: this.state.truckLength.id
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      this.refs.poptip.success('添加车辆成功');

      if (res.retcode === 0) {
        history.back();
      }
    }).catch(() => {
      this.refs.poptip.warn('添加车辆失败');
    }).done(() => {
      this.refs.loading.close();
    });
  }

  /**
   * 必填字段校验
   * @return {Mix} 错误提示信息 或 true
   */
  validate() {
    let props = this.props;

    if ($.trim(props.name) === '') {
      return '司机姓名不能为空';
    }

    if ($.trim(props.tel) === '') {
      return '手机号不能为空';
    }

    if ($.trim(props.license) === '') {
      return '车牌号不能为空';
    }

    if ($.trim(this.state.truckType) === '') {
      return '车型不能为空';
    }

    if ($.trim(this.state.truckLength) === '') {
      return '车长不能为空';
    }

    if ($.trim(props.weight) === '') {
      return '载重不能为空';
    }

    return true;
  }

  render() {
    let props = this.props;

    let truckType = this.state.truckType;
    let truckLength = this.state.truckLength;
    let truckDesc = truckType.name ? `${truckType.name} ${truckLength.name || ''}` : null;

    return (
      <section className="truck-add-page">
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="field-group">
            <div className="field">
              <label><b>*</b>司机姓名</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="输入司机姓名"
                  value={props.name}
                  onChange={props.handleStrChange.bind(this, 'name')}
                />
              </div>
            </div>
            <div className="field">
              <label><b>*</b>手机号</label>
              <div className="control">
                <input
                  type="tel"
                  placeholder="输入手机号码"
                  value={props.tel}
                  onChange={props.handleMobileNoChange.bind(this, 'tel')}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label><b>*</b>车牌号</label>
            <div className="control">
              <input
                type="text"
                placeholder="输入车牌号"
                value={props.license}
                onChange={props.handleStrChange.bind(this, 'license')}
              />
            </div>
          </div>
          <div className="field">
            <label><b>*</b>车型</label>
            <div className="control with-arrow">
              <input
                disabled
                type="text"
                placeholder="选择车型"
                onClick={this.handleSelectTruckType.bind(this)}
                value={truckDesc}
              />
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field">
            <label><b>*</b>载重</label>
            <div className="control with-unit">
              <input
                type="text"
                placeholder="输入载重"
                value={props.weight}
                onChange={props.handleFloatChange.bind(this, 'weight')}
              />
              <span className="unit">吨</span>
            </div>
          </div>

          <div className="submit">
            <button type="submit" className="btn block teal">确定</button>
          </div>
        </form>
        <Selector
          ref="selector"
          items={this.state.selectorItems}
          select={this.handleSelectItem.bind(this)} />
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<TruckAddPage />, $('#page').get(0));
