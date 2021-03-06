import './index.less';

import React from 'react';

const WH_REG = /\[\d+:\d+\]/g;

export default class Gallery extends React.Component {
  constructor() {
    super();
  }

  handleShowPic(img: string, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.props.wx_ready) {
      return;
    }

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
        item = item.replace(WH_REG, '');
        let bg = {
          backgroundImage: `url(${item}!small)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        };
        return (
          <li
            key={'img_' + index}
            onClick={this.handleShowPic.bind(this, item)}>
            <a href={item} style={bg}></a>
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
