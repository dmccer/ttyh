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
import cx from 'classnames';
import querystring from 'querystring';

import $ from '../../helper/z';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Selector from '../../selector/';
import Log from '../../log/';
import {FieldChangeEnhance} from '../../enhance/field-change';
import {SelectTruckTypeEnhance} from '../../enhance/select-truck-type';
import AH from '../../helper/ajax';
import {
  GetTruck,
  AddTruck,
  EditTruck
} from '../model/';
import {
  SELECTED_COMMON_ROUTE,
  TRUCK_ADD_DRAFT
} from '../../const/truck-pub';

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class TruckAddPage extends React.Component {
  state = {
    qs: querystring.parse(location.search.substring(1))
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if ($.trim(this.state.qs.tid) != '') {
      this.setState({
        edit: true
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    if (this.state.edit) {
      // 编辑并且已有新编辑的内容
      if (this.state.qs.refer === 'back') {
        this.readLocal();
        return;
      }

      // 先清除上次的数据
      this.clearData();

      // 首次进入编辑
      this.getTruck();
      return;
    }

    this.readLocal();
  }

  writeRemoteToLocal(truck: Object) {
    let commonRoute = {
      fromCity: truck.fromcity,
      toCity: truck.tocity
    };

    let mappedTruck = {
      name: truck.dirverName,
      tel: truck.dirverPoneNo,
      license: truck.licensePlate,
      weight: truck.loadLimit,
      memo: truck.memo,
      truckType: {
        id: truck.truckType,
        name: truck.truckTypeStr
      },
      truckLength: {
        id: truck.truckLength,
        name: `${truck.truckLength}米`
      }
    };

    localStorage.setItem(SELECTED_COMMON_ROUTE, JSON.stringify(commonRoute));
    localStorage.setItem(TRUCK_ADD_DRAFT, JSON.stringify(mappedTruck));

    this.readLocal();
  }

  getTruck() {
    this.ah.one(GetTruck, (res) => {
      this.writeRemoteToLocal(res.truck);
    }, this.state.qs.tid);
  }

  readLocal() {
    let TMP_DATA = JSON.parse(localStorage.getItem(SELECTED_COMMON_ROUTE));
    if (TMP_DATA) {
      this.setState({
        fromCity: TMP_DATA.fromCity,
        toCity: TMP_DATA.toCity,
        commonRouteDesc: TMP_DATA.fromCity && TMP_DATA.toCity ? `${TMP_DATA.fromCity} 到 ${TMP_DATA.toCity}` : ''
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

  clearData() {
    localStorage.removeItem(TRUCK_ADD_DRAFT);
    localStorage.removeItem(SELECTED_COMMON_ROUTE);
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
    let data = {
      dirverName: props.name,
      dirverPoneNo: props.tel,
      licensePlate: props.license,
      loadLimit: props.weight,
      truckType: props.truckType.id,
      truckLength: props.truckLength.id,
      memo: props.memo,
      fromcity: this.state.fromCity,
      tocity: this.state.toCity
    };

    if (this.state.edit) {
      data.truckID = this.state.qs.tid;
    }

    this.ah.one(this.state.edit ? EditTruck: AddTruck, {
      success: (res) => {
        if (res.retcode !== 0) {
          this.refs.poptip.warn('保存车辆失败');

          return;
        }

        this.refs.poptip.success('保存车辆成功');
        this.clearData();
        history.back();
      },
      error: (err) => {
        Log.error(err);

        this.refs.poptip.warn('保存车辆失败');
      }
    }, data);
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

  addCommonRoute() {
    let url = `/select-truck-common-route.html?tid=${this.state.qs.tid || ''}`;

    location.replace(location.protocol + '//' + location.host + location.pathname.replace(/\/[^\/]+$/, url));
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
                onClick={this.addCommonRoute.bind(this)}
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
