import '../../less/global/global.less';
import '../../less/global/form.less';
import '../../less/component/cell-form.less';
import './index.less';

import React, {Component} from 'react';
import {render} from 'react-dom';
import querystring from 'querystring';

import Selector from '../selector/';
import {FieldChangeEnhance} from '../enhance/field-change';
import Poptip from '../poptip/';
import FixedHolder from '../fixed-holder/';
import Loading from '../loading/';
import AH from '../helper/ajax';
import Validator from '../helper/validator';
import {SubmitReport, OrderedEnumValue} from '../model/';

@FieldChangeEnhance
export default class ReportPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    reportTypes: [],
    reportType: {},
    maxReasonLen: 80
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.set('tel', this.state.qs.tel);
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);
    Validator.config(this.refs.poptip);

    this.ah.one(OrderedEnumValue, (res) => {
      let list = res.packTypeMap;

      list = list.map(item => {
        return {
          id: item.key,
          name: item.value
        };
      });

      this.setState({
        reportTypes: list
      });
    }, 'packType');
  }

  showReportType() {
    this.refs.selector.show();
  }

  handleSelectReportType(reportType) {
    this.setState({reportType});
  }

  validate() {
    let props = this.props;
    let states = this.state;

    return (
      Validator.test('required', '请输入被举报人手机号', props.tel) &&
      Validator.test('len', '请输入正确的手机号', props.tel, 11) &&
      Validator.test('required', '请选择类型', states.reportType) &&
      Validator.test('required', '请输入举报理由', props.reason)
    );
  }

  handleSubmit() {
    if (!this.validate()) {
      return;
    }

    this.ah.one(SubmitReport, (res) => {
      if (res.retcode === 0) {
        this.refs.poptip.success('提交成功');
        return;
      }

      this.refs.poptip.warn(res.msg);
    }, {
      tel: this.props.tel,
      reportType: this.state.reportType.id,
      reason: this.props.reason
    });
  }

  render() {
    let props = this.props;

    return (
      <section className="report-page">
        <div className="cells cells-access cells-form">
          <div className="cell required">
            <div className="cell_hd">
              <label className="label">
                <span>被举报人</span>
              </label>
            </div>
            <div className="cell-bd cell-primary">
              <input
                type="tel"
                className="input"
                placeholder="输入被举报人手机号"
                value={props.tel}
                onChange={props.handleMobileNoChange.bind(this, 'tel')}
              />
            </div>
          </div>
          <div
            className="cell required"
            onClick={this.showReportType.bind(this)}>
            <div className="cell_hd">
              <label className="label">选择类型</label>
            </div>
            <div className="cell-bd cell-primary">
              <p className={this.state.reportType ? 'val' : 'holder'}>{this.state.reportType.name || '选择'}</p>
            </div>
            <div className="cell-ft"></div>
          </div>
          <div className="cell required">
            <div className="cell-bd cell-primary">
              <textarea
                className="textarea"
                placeholder="输入举报理由"
                value={props.reason}
                onChange={props.handleLimitStrChange.bind(this, 'reason', this.state.maxReasonLen)}
              ></textarea>
            </div>
          </div>
        </div>
        <FixedHolder height="70" />
        <button
          className="btn block teal bottom-btn"
          type="submit"
          onClick={this.handleSubmit.bind(this)}
        >发送</button>
        <Poptip ref="poptip" />
        <Loading ref="loading" />
        <Selector
          ref="selector"
          title="举报类型"
          items={this.state.reportTypes}
          select={this.handleSelectReportType.bind(this)}
        />
      </section>
    );
  }
}

render(<ReportPage />, document.querySelector('.page'));
