import '../../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ImgItem4Picker from './item';
import Poptip from '../../../poptip/';
import JWeiXin from '../../../jweixin/';

export default class ImgPicker extends React.Component {
  constructor() {
    super();

    this.state = {
      imgs: []
    }

    new JWeiXin(() => {
      this.setState({
        wxReady: true
      });
    });
  }

  // 选择某一张照片
  pick(img: Object, e: Object) {
    // 显示大图
  }

  // 从相册中选择照片或者拍照
  selectImg(e: Object) {
    e.stopPropagation();

    if (!this.state.wxReady) {
      this.refs.poptip.warn('正在等待微信验证');
      return;
    }

    wx.chooseImage({
      success: (res) => {
        if (res.localIds && res.localIds.length) {
          res.localIds.forEach((localId) => {
            this.state.imgs.push({
              url: localId
            });
          });

          this.forceUpdate();
        }
      }
    });

    // imgs 发生改变
    this.props.onImgsChange(this.state.imgs);
  }

  // 删除照片
  del(imgItem: Object) {
    let index = this.state.imgs.indexOf(imgItem);

    this.state.imgs.splice(index, 1);
    this.forceUpdate();

    // imgs 发生改变
    this.props.onImgsChange(this.state.imgs);
  }

  render() {
    let imgItemList = this.state.imgs.map((img, index) => {
      return <ImgItem4Picker
        key={'img-item-4picker_' + index}
        item={img}
        onPick={this.pick.bind(this)}
        onRemove={this.del.bind(this)} />
    });

    return (
      <section className="img-picker">
        {imgItemList}
        <div
          className="img-item4picker add-img-item"
          onClick={this.selectImg.bind(this)}>
          <div className="img-item-inner"></div>
        </div>
        <Poptip ref="poptip" />
      </section>
    )
  }
}
