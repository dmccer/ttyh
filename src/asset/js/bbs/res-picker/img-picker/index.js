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
      </section>
    )
  }
}
