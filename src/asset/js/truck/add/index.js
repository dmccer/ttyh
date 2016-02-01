/**
 * 添加车辆页面 ./truck-add.html
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
import {SelectTruckTypeEnhance} from '../../enhance/select-truck-type';

const ERR_MSG = {
  1001: '没有找到用户',
  1002: '您没有登录'
};

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class TruckAddPage extends React.Component {
  state = {};

  constructor(props) {
    super(props);
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
          truckType: props.truckType.id,
          truckLength: props.truckLength.id
        },
        success: resolve,
        error: reject
      });
    }).then((res) => {
      if (res.retcode !== 0) {
        this.refs.poptip.warn(ERR_MSG[res.retcode]);

        return;
      }

      this.refs.poptip.success('添加车辆成功');
      history.back();
    }).catch((err) => {
      Log.error(err);

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

    if (!/^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$/.test($.trim(props.license))) {
      return '车牌号格式不正确';
    }

    if (!props.truckType || $.trim(props.truckType.id) === '') {
      return '车型不能为空';
    }

    if (!props.truckLength || $.trim(props.truckLength.id) === '') {
      return '车长不能为空';
    }

    if ($.trim(props.weight) === '') {
      return '载重不能为空';
    }

    if (parseFloat(props.weight) > 9999) {
      return '载重不能超过9999吨';
    }

    return true;
  }

  render() {
    let props = this.props;

    let truckType = props.truckType;
    let truckLength = props.truckLength;
    let truckDesc = truckType && truckType.name ? `${truckType.name} ${truckLength && truckLength.name}` : null;

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
                onClick={props.handleSelectTruckType.bind(this)}
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
        <Loading ref="loading" />
        <Poptip ref="poptip" />
      </section>
    );
  }
}

ReactDOM.render(<TruckAddPage />, $('#page').get(0));
