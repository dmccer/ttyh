import React from 'react';

export default class ImgItem4Picker extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="img-item4picker">
        <div className="img-item-inner">
          <img src="http://img2.ph.126.net/1bwNe2kDqwt-FzPFQcIXbw==/6630455337722996867.jpg" />
          <i className="img-operation icon icon-del-dot"></i>
        </div>
      </div>
    )
  }
}
