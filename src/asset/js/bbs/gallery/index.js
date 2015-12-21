import './index.less';

import React from 'react';
import JWeiXin from '../../jweixin/';

export default class Gallery extends React.Component {
  constructor() {
    super();

    this.state = {
      ready: false
    };

    new JWeiXin(() => {
      this.setState({
        ready: true
      });
    });
  }

  handleShowPic(img: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    wx.previewImage({
      current: img,
      urls: this.props.imgs
    });
  }

  render() {
    let _imgs = this.props.imgs;
    let imgs;

    if (_imgs && _imgs.length) {
      let lenStr = <span className="photo-tip">共{_imgs.length}张</span>;

      imgs = _imgs.map((item, index) => {
        let count = index === 2 ? lenStr : null;

        return (
          <li
            key={'img_' + index}
            onClick={this.handleShowPic.bind(this, item)}>
            <a href={item}>
              <img src={item + '!small'} />
            </a>
            {count}
          </li>
        );
      });
    }

    if (imgs && imgs.length > 3) {
      imgs.splice(3, _imgs.length - 3);
    }

    return (
      <ul className="post-photos">
        {imgs}
      </ul>
    );
  }
}
