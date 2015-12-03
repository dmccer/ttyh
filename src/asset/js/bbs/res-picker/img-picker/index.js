import '../../../../less/component/icon.less';
import './index.less';

import React from 'react';
import ImgItem4Picker from './item';

export default class ImgPicker extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="img-picker">
        <ImgItem4Picker />
        <ImgItem4Picker />
        <ImgItem4Picker />
        <ImgItem4Picker />

        <div className="img-item4picker add-img-item">
          <div className="img-item-inner">
          </div>
        </div>
      </section>
    )
  }
}
