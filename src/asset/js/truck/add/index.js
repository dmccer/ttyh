/**
 * 添加车辆页面 ./truck-add.html
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/global/form.less';
import '../../../less/component/form.less';
import '../../../less/component/icon.less';

import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'promise';
import cx from 'classnames';

import $ from '../../helper/z';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Selector from '../../selector/';
import Log from '../../log/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import {SelectTruckTypeEnhance} from '../../enhance/select-truck-type';
import AH from '../../helper/ajax';
import {
  AddTruck
} from '../model/';
import {
  SELECTED_COMMON_ROUTE,
  TRUCK_ADD_DRAFT
} from '../../const/truck-pub';

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

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    let TMP_DATA = JSON.parse(localStorage.getItem(SELECTED_COMMON_ROUTE));
    if (TMP_DATA) {
      this.setState({
        fromCity: TMP_DATA.fromCity,
        toCity: TMP_DATA.toCity,
        commonRouteDesc: `${TMP_DATA.fromCity} 到 ${TMP_DATA.toCity}`
      });
    }

    let TMP_TRUCK_DATA = JSON.parse(localStorage.getItem(TRUCK_ADD_DRAFT));
    if (TMP_TRUCK_DATA) {
      this.props.setFields({
        name: TMP_TRUCK_DATA.name,
        tel: TMP_TRUCK_DATA.tel,
        license: TMP_TRUCK_DATA.license,
        weight: TMP_TRUCK_DATA.weight,
        memo: TMP_TRUCK_DATA.memo
      });

      this.props.setSelectTruckTypeData({
        truckType: TMP_TRUCK_DATA.truckType,
        truckLength: TMP_TRUCK_DATA.truckLength
      });
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

    let props = this.props;

    this.ah.one(AddTruck, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn(ERR_MSG[res.retcode]);

          return;
        }

        this.refs.poptip.success('添加车辆成功');
        localStorage.removeItem(TRUCK_ADD_DRAFT);
        localStorage.removeItem(SELECTED_COMMON_ROUTE);
        
        history.back();
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('添加车辆失败');
      }
    }, {
      dirverName: props.name,
      dirverPoneNo: props.tel,
      licensePlate: props.license,
      loadLimit: props.weight,
      truckType: props.truckType.id,
      truckLength: props.truckLength.id,
      memo: props.memo
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

  writeDraft() {
    let props = this.props;

    localStorage.setItem(TRUCK_ADD_DRAFT, JSON.stringify({
      name: props.name,
      tel: props.tel,
      license: props.license,
      weight: props.weight,
      truckType: props.truckType,
      truckLength: props.truckLength,
      memo: props.memo
    }));
  }

  render() {
    let props = this.props;

    let truckType = props.truckType;
    let truckLength = props.truckLength;
    let truckDesc = truckType && truckType.name ? `${truckType.name} ${truckLength && truckLength.name || ''}` : null;

    return (
      <section className="truck-add-page">
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="field-group">
            <div className="field required">
              <label className="label"><span>司机姓名</span></label>
              <div className="control">
                <input
                  type="text"
                  placeholder="输入司机姓名"
                  value={props.name}
                  onChange={props.handleStrChange.bind(this, 'name', this.writeDraft.bind(this))}
                />
              </div>
            </div>
            <div className="field required">
              <label className="label"><span>手机号</span></label>
              <div className="control">
                <input
                  type="tel"
                  placeholder="输入手机号码"
                  value={props.tel}
                  onChange={props.handleMobileNoChange.bind(this, 'tel', this.writeDraft.bind(this))}
                />
              </div>
            </div>
          </div>
          <div className="field required">
            <label className="label"><span>车牌号</span></label>
            <div className="control">
              <input
                type="text"
                placeholder="输入车牌号"
                value={props.license}
                onChange={props.handleStrChange.bind(this, 'license', this.writeDraft.bind(this))}
              />
            </div>
          </div>
          <div className="field required">
            <label className="label"><span>车型</span></label>
            <div className="control with-arrow">
              <span
                className={cx('input-holder', truckDesc && 'on' || '')}
                onClick={props.handleSelectTruckType.bind(this, this.writeDraft.bind(this))}
              >{truckDesc || '选择车型'}</span>

              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field required">
            <label className="label"><span>载重</span></label>
            <div className="control with-unit">
              <input
                type="text"
                placeholder="输入载重"
                value={props.weight}
                onChange={props.handleFloatChange.bind(this, 'weight', this.writeDraft.bind(this))}
              />
              <span className="unit">吨</span>
            </div>
          </div>
          <div className="field">
            <label className="label"><span>常跑路线</span></label>
            <div className="control with-arrow">
              <a
                href="./select-truck-common-route.html"
                className={cx('input-holder', this.state.commonRouteDesc && 'on' || '')}
              >{this.state.commonRouteDesc || '请选择常跑路线'}</a>
              <i className="icon icon-arrow"></i>
            </div>
          </div>
          <div className="field memo">
            <label className="label"><span>备注</span></label>
            <div className="control">
              <textarea
                placeholder="说点什么"
                value={props.memo}
                onChange={props.handleLimitStrChange.bind(this, 'memo', 80, this.writeDraft.bind(this))}
              ></textarea>
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

ReactDOM.render(<TruckAddPage />, document.querySelector('.page'));
