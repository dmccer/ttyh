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

export default class TruckAddPage extends React.Component {
  constructor() {
    super();

    this.state = {
      truckType: {},
      truckLength: {}
    };
  }

  componentDidMount() {

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
      .catch((...args) => {
        this.refs.poptip.warn('获取车型或车长列表失败,请重新打开页面');

        console.error(`${new Date().toLocaleString()} - 错误日志 start`)
        console.error(args[0])
        console.error(`-- 错误日志 end --`)
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
      $.ajax({
        url: '/mvc/v2/insertTruck',
        type: 'POST',
        data: {
          dirverName: this.state.name,
          dirverPoneNo: this.state.tel,
          licensePlate: this.state.license,
          truckType: this.state.truckType.id,
          loadLimit: this.state.weight,
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

  validate() {
    if ($.trim(this.state.name) === '') {
      return '司机姓名不能为空';
    }

    if ($.trim(this.state.tel) === '') {
      return '手机号不能为空';
    }

    if ($.trim(this.state.license) === '') {
      return '车牌号不能为空';
    }

    if ($.trim(this.state.truckType) === '') {
      return '车型不能为空';
    }

    if ($.trim(this.state.weight) === '') {
      return '载重不能为空';
    }

    return true;
  }

  // handleSelectItem(item) {
  //   this.setState({
  //     [this.state.selectorField]: item
  //   });
  // }
  //
  // showSelector(field, e) {
  //   this.setState({
  //     selectorItems: this.state[`${field}s`],
  //     selectorField: field
  //   });
  //
  //   this.refs.selector.show();
  // }

  handleNumChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value).replace(/[^\d\.]+/g, '')
    });
  }

  handleTelChange(e: Object) {
    this.setState({
      tel: $.trim(e.target.value).replace(/[^\d]+/g, '')
    });
  }

  handleStrChange(field: string, e: Object) {
    this.setState({
      [field]: $.trim(e.target.value)
    });
  }

  render() {
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
                  value={this.state.name}
                  onChange={this.handleStrChange.bind(this, 'name')}
                />
              </div>
            </div>
            <div className="field">
              <label><b>*</b>手机号</label>
              <div className="control">
                <input
                  type="tel"
                  placeholder="输入手机号码"
                  value={this.state.tel}
                  onChange={this.handleTelChange.bind(this)}
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
                value={this.state.license}
                onChange={this.handleStrChange.bind(this, 'license')}
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
                value={this.state.weight}
                onChange={this.handleNumChange.bind(this, 'weight')}
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
