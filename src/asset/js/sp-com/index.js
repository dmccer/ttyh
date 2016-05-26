import '../../less/global/global.less';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';

import SP_COM_PNG from '../../img/app/building@3x.png';

export default class SpComDetail extends React.Component {
  render() {
    return (
      <div class="myFirmDdetails">
        <img src={SP_COM_PNG} class="firmImg" />
        <div class="details">该专线公司暂无介绍页</div>
      </div>
    );
  }
}

ReactDOM.render(<SpCom />, document.querySelector('.page'));
