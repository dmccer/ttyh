import './index.less';

import React from 'react';

export default class FullscreenImg extends React.Component {
  constructor() {
    super();
  }

  handleClick(e: Object) {
    e.preventDefault();
    e.stopPropagation();
  }

  close() {
    this.props.onClose();
  }

  render() {
    return (
      <section className="fullscreen-img" onClick={this.handleClick.bind(this)}>
        <div className="img-count">
          <span>1 / 9</span>
        </div>
        <div className="img-action">
          <span className="icon icon-close" onClick={this.close.bind(this)}>x</span>
        </div>
        <div className="img-list">
          <div className="img-item"><img src="http://img0.ph.126.net/jLvpNC-xm4qD2VrPwzSmWg==/6631427306003511693.jpg" /></div>
          <div className="img-item"><img src="http://img1.ph.126.net/CdvWPI9K01GpLCKCpht9vQ==/6631254682677950221.jpg" /></div>
          <div className="img-item"><img src="http://img1.ph.126.net/DwU7tVr_0T5w3Np2kawAHw==/6631359136282591852.jpg" /></div>
          <div className="img-item"><img src="http://img1.ph.126.net/S4IK-053NaLzAti-OTRv_w==/6631284369491899360.jpg" /></div>
          <div className="img-item"><img src="http://img2.ph.126.net/woO0H3tb31ltdAPhimJAVQ==/6631402017236070443.jpg" /></div>
          <div className="img-item"><img src="http://img2.ph.126.net/8yyGsnFYZqhlHzSiRQylIg==/6631365733352356874.jpg" /></div>
          <div className="img-item"><img src="http://img0.ph.126.net/j6XDRuqnQrg-BY6O9WTyAA==/6631266777305858952.jpg" /></div>
        </div>
      </section>
    )
  }
}
