import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import '../../../../less/component/cell-form.less';
import '../../../../less/component/icon.less';
import '../../../../less/component/tag.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';
import assign from 'lodash/object/assign';

import Poptip from '../../../poptip/';
import Loading from '../../../loading/';
import FixedHolder from '../../../fixed-holder/';
import {FieldChangeEnhance} from '../../../enhance/field-change';

import AH from '../../../helper/ajax';
import {OrderedEnumValue} from '../../../model/';
import Validator from '../../../helper/validator';
import {PKG_INFO_DATA} from '../../../const/pkg-pub';

@FieldChangeEnhance
export default class PkgInfoPubPage extends Component {
  state = {
    checkedPackManner: {}
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let TMP_DATA = JSON.parse(localStorage.getItem(PKG_INFO_DATA));

    if (TMP_DATA) {
      this.props.setFields({
        pkgName: TMP_DATA.pkgName,
        pkgWeight: TMP_DATA.pkgWeight,
        pkgCount: TMP_DATA.pkgCount,
        pkgVolume: TMP_DATA.pkgVolume
      });

      this.setState({
        checkedPackManner: TMP_DATA.packManner || {}
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.ah.one(OrderedEnumValue, (res) => {
      let packManners = res.packTypeMap.map(packManner => {
        return {
          name: packManner.value,
          id: packManner.key
        };
      });

      let checkedPackManner = this.state.checkedPackManner;

      this.setState({
        packManners: packManners,
        loaded: true,
        checkedPackManner: checkedPackManner.id != null ? checkedPackManner : packManners[0]
      }, () => {
        Validator.config(this.refs.poptip);
      });
    }, 'packType');
  }

  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请填写货物名称', props.pkgName) &&
      Validator.test('required', '请填写货物重量', props.pkgWeight) &&
      Validator.test('min', '请填写货物重量', props.pkgWeight, 0, false) &&
      Validator.test('max', '最大货物重量不能超过 9999.9 吨', props.pkgWeight, 9999.9) &&
      Validator.test('required', '请选择货物包装', states.checkedPackManner.id) &&
      (!props.pkgVolume ||
        (
          Validator.test('max', '最大体积不能超过 9999.9 方', props.pkgVolume, 9999.9) &&
          Validator.test('min', '请填写货物体积', props.pkgVolume, 0, false)
        )
      )
    );
  }

  handleSubmit() {
    let valid = this.validate();

    if (!valid) {
      return;
    }

    let props = this.props;

    localStorage.setItem(PKG_INFO_DATA, JSON.stringify({
      pkgName: props.pkgName,
      pkgWeight: props.pkgWeight,
      packManner: this.state.checkedPackManner,
      pkgVolume: props.pkgVolume,
      pkgCount: props.pkgCount
    }));

    history.back();
  }

  handleSelectPackManner(packManner: Object) {
    let cur = this.state.checkedPackManner;

    if (packManner === cur) {
      return;
    }

    this.setState({
      checkedPackManner: packManner
    });
  }

  renderPkgPackManners() {
    let checkedPackMannerId = this.state.checkedPackManner.id;
    let packManners = this.state.packManners;

    if (packManners) {
      let pms = packManners.map((pm, index) => {
        return (
          <label className="tag" key={`packManner-item_${index}`}>
            <input
              type="radio"
              name="truckType"
              className="check"
              value={pm.id}
              checked={pm.id === checkedPackMannerId}
              onChange={this.handleSelectPackManner.bind(this, pm)} />
            <p>{pm.name}</p>
          </label>
        );
      });

      return (
        <div className="tags col-3">
          {pms}
        </div>
      );
    }
  }

  renderPkgCount() {
    let props = this.props;

    if (this.state.checkedPackManner.id != null) {
      return (
        <div className="cell">
          <div className="cell_hd">
            <label className="label">
              <span>数量</span>
            </label>
          </div>
          <div className="cell-bd cell_primary">
            <p className="val">{this.state.checkedPackManner.name}&nbsp;*&nbsp;</p>
          </div>
          <div className="cell-ft">
            <input
              type="text"
              className="input num"
              placeholder="填写数量"
              value={props.pkgCount}
              onChange={props.handleIntegerChange.bind(this, 'pkgCount')}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    let props = this.props;

    return (
      <section className="pkg-info-page">
        <div className="cells cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>货物名称</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写货物名称"
                value={props.pkgName}
                onChange={props.handleLimitStrChange.bind(this, 'pkgName', 20)}
              />
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required unit">
            <div className="cell_hd">
              <label className="label">
                <span>货物重量</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写货物重量"
                value={props.pkgWeight}
                onChange={props.handleFloatChange.bind(this, 'pkgWeight')}
              />
            </div>
            <div className="cell-ft">吨</div>
          </div>
          <div className="cell unit">
            <div className="cell_hd">
              <label className="label">
                <span>货物体积</span>
              </label>
            </div>
            <div className="cell-bd cell_primary">
              <input
                type="text"
                className="input"
                placeholder="填写货物体积"
                value={props.pkgVolume}
                onChange={props.handleFloatChange.bind(this, 'pkgVolume')}
              />
            </div>
            <div className="cell-ft">方</div>
          </div>
          <div className="pkg-pack-manner required">
            <div className="pm-hd">
              <label className="label">
                <span>货物包装</span>
              </label>
            </div>
            {this.renderPkgPackManners()}
          </div>
          {this.renderPkgCount()}
        </div>
        <FixedHolder height="70" />
        <div className="bottom-btn">
          <button
            className="btn block teal"
            type="submit"
            onClick={this.handleSubmit.bind(this)}
          >
            确定
          </button>
        </div>
        <Poptip ref="poptip" />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<PkgInfoPubPage />, document.querySelector('.page'));
