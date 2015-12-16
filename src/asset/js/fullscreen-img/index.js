import '../../../../node_modules/slick-carousel/slick/slick.less';
import './index.less';

import React from 'react';
import Slider from 'react-slick';


export default class FullscreenImg extends React.Component {
  constructor() {
    super();

    this.state = {
      on: 1
    }
  }

  componentDidMount() {
    this.setState({
      on: this.props.on + 1
    })
  }

  handleClick(e: Object) {
    e.preventDefault();
    e.stopPropagation();
  }

  close() {
    this.props.onClose();
  }

  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      className: 'img-list',
      initialSlide: this.props.on,
      arrows: false,
      centerMode: true,
      afterChange: (index) => {
        this.setState({
          on: index + 1
        });
      }
    };

    let imgList = this.props.images.map((imgItem, index) => {
      return <div className="img-item" key={'img-item_' + index}><img src={imgItem} /></div>;
    });

    return (
      <section className="fullscreen-img" onClick={this.handleClick.bind(this)}>
        <div className="img-count">
          <span>{this.state.on} / {this.props.images.length}</span>
        </div>
        <div className="img-action">
          <span className="icon icon-close" onClick={this.close.bind(this)}></span>
        </div>
        <Slider {...settings}>
          {imgList}
        </Slider>
      </section>
    )
  }
}
