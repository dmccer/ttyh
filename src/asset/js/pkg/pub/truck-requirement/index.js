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

import Selector from '../../../selector/';
import Poptip from '../../../poptip/';
import Loading from '../../../loading/';
import FixedHolder from '../../../fixed-holder/';
import {FieldChangeEnhance} from '../../../enhance/field-change';
import {SelectTruckTypeEnhance} from '../../../enhance/select-truck-type';
import AH from '../../../helper/ajax';

const TRUCK_TYPES = [
  {
    name: '整车',
    id: 1
  }, {
    name: '零担',
    id: 2
  }
];
const SPECIAL_TRUCK_TYPE_ID = 2;

@FieldChangeEnhance
@SelectTruckTypeEnhance
export default class TruckRequirementPage extends React.Component {
  state = {
    checkedTruckType: {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
  }

  handleSubmit() {}

  writeDraft() {}

  handleClickSelectTruckType() {
    let props = this.props;
    let checkedTruckTypeId = this.state.checkedTruckType.id;

    props.setTruckEnhanceSelectorType(checkedTruckTypeId === SPECIAL_TRUCK_TYPE_ID ? 0 : 1);
    props.handleSelectTruckType(this.writeDraft.bind(this));
  }

  handleSetTruckTypeCategory(tType: Object) {
    let cur = this.state.checkedTruckType;

    if (tType === cur) {
      return;
    }

    this.setState({
      checkedTruckType: tType
    });
  }

  renderTruckTypes() {
    let checkedTruckTypeId = this.state.checkedTruckType.id;

    let tTypes = TRUCK_TYPES.map((tType, index) => {
      return (
        <label className="tag" key={`truckType-item_${index}`}>
          <input
            type="radio"
            name="truckType"
            className="check"
            value={tType.id}
            checked={tType.id === checkedTruckTypeId}
            onClick={this.handleSetTruckTypeCategory.bind(this, tType)} />
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
    let checkedTruckTypeId = this.state.checkedTruckType.id;
    if (checkedTruckTypeId === SPECIAL_TRUCK_TYPE_ID) {
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
    let truckTypeValStr = `${props.truckType.name || ''} ${this.state.checkedTruckType.id !== SPECIAL_TRUCK_TYPE_ID ? (props.truckLength.name || '') : ''}`;

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
        <button
          className="btn block teal bottom-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >
          发布
        </button>
      </section>
    );
  }
}

ReactDOM.render(<TruckRequirementPage />, document.querySelector('.page'));
