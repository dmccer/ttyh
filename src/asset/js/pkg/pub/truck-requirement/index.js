import '../../../../less/global/global.less';
import '../../../../less/global/form.less';
import '../../../../less/component/cell.less';
import '../../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Promise from 'promise';
import cx from 'classnames';
import assign from 'lodash/object/assign';
import find from 'lodash/collection/find';

import Selector from '../../../selector/';
import Poptip from '../../../poptip/';
import Loading from '../../../loading/';
import FixedHolder from '../../../fixed-holder/';
import {FieldChangeEnhance} from '../../../enhance/field-change';
import {SelectTruckTypeEnhance} from '../../../enhance/select-truck-type';
import AH from '../../../helper/ajax';
import Validator from '../../../helper/validator';
import {
  PKG_TRUCK_USE_DATA,
  TRUCK_USE_TYPES,
  DEFAULT_TRUCK_USE_TYPE_ID,
  JUST_SELECT_TRUCK_TYPE
} from '../../../const/pkg-pub';

const TMP_TUD = JSON.parse(localStorage.getItem(PKG_TRUCK_USE_DATA));

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class TruckRequirementPage extends React.Component {
  state = {
    checkedTruckUseType: {}
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let checkedTruckUseTypeId = TMP_TUD ? TMP_TUD.truckUseType.id : DEFAULT_TRUCK_USE_TYPE_ID;
    let checkedTruckUseType = find(TRUCK_USE_TYPES, (item) => {
      return item.id === checkedTruckUseTypeId;
    });

    this.setState({
      checkedTruckUseType: checkedTruckUseType
    });

    if (TMP_TUD) {
      this.props.setFields({
        stallSize: TMP_TUD.stallSize
      });

      this.props.setSelectTruckTypeData({
        truckType: TMP_TUD.truckType,
        truckLength: TMP_TUD.truckLength
      });
    }
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    Validator.config(this.refs.poptip);
  }

  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请选择车型', props.truckType.id) &&
      (
        states.checkedTruckUseType.id !== 1 ||
        (
          Validator.test('required', '请选择车长', props.truckLength.id) &&
          Validator.test('min', '请选择车长', props.truckLength.id, 0, false)
        )
      ) &&
      (
        states.checkedTruckUseType.id !== 2 ||
        (
          Validator.test('required', '请填写占用车位', props.stallSize) &&
          Validator.test('min', '请填写占用车位', props.stallSize, 0, false)
        )
      )
    );
  }

  handleSubmit() {
    let props = this.props;
    let states = this.state;

    if (!this.validate()) {
      return;
    }

    localStorage.setItem(PKG_TRUCK_USE_DATA, JSON.stringify({
      truckType: props.truckType,
      truckLength: props.truckLength,
      stallSize: props.stallSize,
      truckUseType: states.checkedTruckUseType
    }));

    history.back();
  }

  handleClickSelectTruckType() {
    let props = this.props;
    let checkedTruckUseTypeId = this.state.checkedTruckUseType.id;
    let special = checkedTruckUseTypeId === JUST_SELECT_TRUCK_TYPE;

    props.setTruckEnhanceSelectorType(special ? 0 : 1);
    props.handleSelectTruckType();
  }

  handleSetTruckTypeCategory(tType: Object) {
    let cur = this.state.checkedTruckUseType;

    if (tType === cur) {
      return;
    }

    this.setState({
      checkedTruckUseType: tType
    });

    if (tType.id === JUST_SELECT_TRUCK_TYPE) {
      this.props.setSelectTruckTypeData({
        truckLength: {}
      });
    }
  }

  renderTruckTypes() {
    let checkedTruckUseTypeId = this.state.checkedTruckUseType.id;

    let tTypes = TRUCK_USE_TYPES.map((tType, index) => {
      return (
        <label className="tag" key={`truckType-item_${index}`}>
          <input
            type="radio"
            name="truckType"
            className="check"
            value={tType.id}
            checked={tType.id === checkedTruckUseTypeId}
            onChange={this.handleSetTruckTypeCategory.bind(this, tType)} />
          <p>{tType.name}</p>
        </label>
      );
    });

    return (
      <div className="tags">
        {tTypes}
      </div>
    );
  }

  renderStallSize() {
    let checkedTruckUseTypeId = this.state.checkedTruckUseType.id;
    if (checkedTruckUseTypeId === JUST_SELECT_TRUCK_TYPE) {
      let props = this.props;

      return (
        <div className="cell no-access">
          <div className="cell_hd">
            <label className="label">占用车位</label>
          </div>
          <div className="cell-bd cell_primary">
            <input
              type="text"
              className="input"
              value={props.stallSize}
              onChange={props.handleFloatChange.bind(this, 'stallSize')} />
          </div>
          <div className="cell-ft">米</div>
        </div>
      );
    }
  }

  render() {
    let props = this.props;
    let truckTypeValStr = `${props.truckType.name || ''} ${this.state.checkedTruckUseType.id !== JUST_SELECT_TRUCK_TYPE ? (props.truckLength.name || '') : ''}`;

    return (
      <section className="truck-requirement">
        <h2 className="cells-title tags-title">用车类型</h2>
        {this.renderTruckTypes()}

        <div className="cells cells-access cells-form">
          <div
            className="cell"
            onClick={this.handleClickSelectTruckType.bind(this)}>
            <div className="cell_hd">
              <label className="label">车型</label>
            </div>
            <div className="cell-bd cell_primary">
              <p className="val">{truckTypeValStr}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          {this.renderStallSize()}
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

ReactDOM.render(<TruckRequirementPage />, document.querySelector('.page'));
