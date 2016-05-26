/**
 * 车源详情页面
 *
 * @author Kane xiaoyunhua@ttyhuo.cn
 */
import '../../../less/global/global.less';
import '../../../less/global/layout.less';
import '../../../less/component/icon.less';
import '../../../less/component/flag.less';
import './index.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import cx from 'classnames';

import Avatar from '../../avatar/';
import AccountCertifyStatus from '../../account-certify-status/';
import {MiniReadableTime} from '../../bbs/readable-time/';
import Poptip from '../../poptip/';
import Loading from '../../loading/';
import Confirm from '../../confirm/';
import Log from '../../log/';
import FixedHolder from '../../fixed-holder/';
import JWeiXin from '../../jweixin/';
import $ from '../../helper/z';
import AH from '../../helper/ajax';
import {
  UserVerifyStatus
} from '../../account/model/';
import {
  REAL_NAME_CERTIFY_TITLE,
  REAL_NAME_CERTIFY_TIP_FOR_VIEW
} from '../../const/certify';
import {
  TruckUsers,
  FollowUser
} from '../model/';

export default class TruckDetailPage extends Component {
  state = {
    qs: querystring.parse(location.search.substring(1)),
    rtruck: {
      userWithLatLng: {}
    }
  };

  constructor() {
    super();
  }

 componentDidMount() {
   this.ah = new AH(this.refs.loading, this.refs.poptip);

   this.ah.one(TruckUsers, {
     success: (res) => {
       if (res.retcode !== 0) {
         this.refs.poptip.warn('加载车源详情失败, 请重试');

         return;
       }

       this.setState({
         rtruck: res.data[0]
       });
     },
     error: (err) => {
       Log.error(err);

       this.refs.poptip.warn('加载货源详情失败, 请重试');
     }
   }, {
     routeIDs: this.state.qs.tid
   });

   this.fetchUserInfo();
 }

 fetchUserInfo() {
   this.ah.one(UserVerifyStatus, (res) => {
     this.setState({
       realNameVerifyStatus: res.auditStatus
     });
   });
 }

 handleShowVerifyTip(tel, e) {
   e.preventDefault();
   e.stopPropagation();

   this.setState({
     activeTel: tel
   }, () => {
     let status = this.state.realNameVerifyStatus;

     if (status === 1 || status === 0) {
       this.handleCancelVerify();
       return;
     }

     this.refs.verifyTip.show({
       title: REAL_NAME_CERTIFY_TITLE,
       msg: REAL_NAME_CERTIFY_TIP_FOR_VIEW
     });
   });
 }

 handleCancelVerify() {
   this.refs.telPanel.show({
     title: '拨打电话',
     msg: this.state.activeTel
   });
 }

 follow() {
   this.ah.one(FollowUser, {
     success: (res) => {
       if (res.errMsg) {
         this.refs.poptip.warn(res.errMsg);

         return;
       }

       let rtruck = this.state.rtruck;
       rtruck.userWithLatLng.alreadyFavorite = true;

       this.setState({
         rtruck: rtruck
       }, () => {
         this.refs.poptip.success('关注成功');
       });
     },
     error: (err) => {
       Log.error(err);
       this.refs.poptip.success('关注失败');
     }
   }, this.state.rtruck.userWithLatLng.userID);
 }

 renderFollowStatus() {
   let rtruck = this.state.rtruck;
   let rtruckDetail = rtruck.userWithLatLng;

   if (rtruckDetail.alreadyFavorite) {
     return (
       <span
         className="followed">
         <i className="icon icon-correct s20"></i>
         <span><b>已关注</b></span>
       </span>
     );
   }

   return (
     <span
       className="follow"
       onClick={this.follow.bind(this)}>
       <i className="icon icon-plus"></i>
       <span><b>关注</b></span>
     </span>
   );
 }

 renderCities(cities, color) {
   let cxs = `capsule ${color}`;

   if (cities && cities.length) {
     return cities.map((city, index) => {
       return <i key={`capsule-item_${index}_${color}`} className={cxs}>{city}</i>;
     })
   }

   return (
     <i className={cxs}>暂无</i>
   );
 }

 toggleMore() {
   this.setState({
     showMore: !this.state.showMore
   });
 }

 renderMemo(memo) {
   if ($.trim(memo) === '') {
     return (<span className="memo">暂无</span>);
   }

   if (memo.length <= 30) {
     return <span className="memo">{memo}</span>;
   }

   let r = this.state.showMore ? memo : `${memo.substring(0, 30)}...`;

   return (
     <span className="memo">
      <span>{r}</span>
      <a href="javascript:void(0)" className="memo-toggler" onClick={this.toggleMore.bind(this)}>{this.state.showMore ? '收起' : '更多'}</a>
     </span>
   );
 }

 render() {
   let rtruck = this.state.rtruck;
   let rtruckDetail = rtruck.userWithLatLng;

   let fromCities = rtruckDetail.fromCities ? rtruckDetail.fromCities.split(',') : null;
   let toCities = rtruckDetail.toCities ? rtruckDetail.toCities.split(',') : null;

   let truckDesc;

   if ($.trim(rtruckDetail.truckTypeStr) == '' &&
     (parseFloat(rtruckDetail.loadLimit) === 0 || rtruckDetail.loadLimit == null) &&
     (parseInt(rtruckDetail.truckLength) === 0 || rtruckDetail.truckLength == null)) {

     truckDesc = '暂无';
   } else {
     let loadLimit = rtruckDetail.loadLimit != null && parseFloat(rtruckDetail.loadLimit) != 0 ? `${rtruckDetail.loadLimit}吨` : '';
     let truckLength = rtruckDetail.truckLength != null && parseInt(rtruckDetail.truckLength) != 0 ? `${rtruckDetail.truckLength}米` : '';

     truckDesc = `${rtruckDetail.truckTypeStr} ${loadLimit} ${truckLength}`;
   }

   let tel = JWeiXin.isWeixinBrowser() ? <span>电话联系</span> : <span>电话联系: {rtruckDetail.mobileNo}</span>

   return (
     <section className="pkg-detail-page">
       <h2 className="subtitle header">
         <span>车源详情</span>
         <span className="pub-time">
           <i className="icon icon-clock"></i>
           <MiniReadableTime time={rtruckDetail.orderByTime} />
         </span>
       </h2>
       <h2 className="subtitle">可装车时间</h2>
       <div className="field-group">
         <div className="field">
           <label><i className="icon icon-calendar s20"></i></label>
           <div className="control">
              <p className="input-holder on">2016-12-11 下午</p>
           </div>
         </div>
       </div>
       <h2 className="subtitle">
        <span>路线</span>
        <i className="flag teal">{rtruckDetail.truckTagStr}</i>
       </h2>
       <div className="field-group lines">
         <div className="field">
           <label><i className="icon icon-start-point on s20"></i></label>
           <div className="control">
              {this.renderCities(fromCities, 'teal')}
           </div>
         </div>
         <div className="field">
           <label><i className="icon icon-end-point on s20"></i></label>
           <div className="control">
            {this.renderCities(toCities, 'purple')}
           </div>
         </div>
       </div>
       <h2 className="subtitle">车辆信息</h2>
       <div className="field-group">
         <div className="field">
           <label><i className="icon icon-truck-type s20"></i></label>
           <div className="control truck-desc">
              <p>{rtruckDetail.licensePlate}</p>
              <p>{truckDesc}</p>
           </div>
         </div>
       </div>
       <h2 className="subtitle">备注</h2>
       <div className="field-group">
         <div className="field memo-field">
           <label><i className="icon icon-memo s20"></i></label>
           <div className="control">
            {this.renderMemo(rtruckDetail.truckStatusMsg)}
           </div>
         </div>
       </div>
       <div className="row">
         <div className="avatar-col">
           <Avatar img={rtruckDetail.faceImgUrl} />
         </div>
         <div className="account-col">
           <span>{rtruckDetail.userName || '佚名'}</span>
           <AccountCertifyStatus
             type='trucker'
             realNameCertified={rtruckDetail.sfzVerify}
             driverCertified={rtruckDetail.driverVerify}
           />
         </div>
         <div className="follow-status-col">
           {this.renderFollowStatus()}
         </div>
       </div>
       <FixedHolder height="50" />
       <a
        onClick={this.handleShowVerifyTip.bind(this, rtruckDetail.mobileNo)}
        href={`tel:${rtruckDetail.mobileNo}`}
        className={cx('call-btn', rtruck.isMyRoute ? 'hide' : '')}>
         <i className="icon icon-call"></i>
         {tel}
       </a>
       <Loading ref="loading" />
       <Poptip ref="poptip" />
       <Confirm
         ref="verifyTip"
         cancel={this.handleCancelVerify.bind(this)}
         rightLink="./real-name-certify.html"
         rightBtnText={'立即认证'}
         leftBtnText={'稍后认证'}
       />
       <Confirm
         ref="telPanel"
         rightLink={`tel:${this.state.activeTel}`}
         rightBtnText={'拨打'}
         leftBtnText={'取消'}
       />
     </section>
   );
 }
}

ReactDOM.render(<TruckDetailPage />, document.querySelector('.page'));
