import React from 'react';

export default class ImgItem4Picker extends React.Component {
  constructor() {
    super();
  }

  del(e: Object) {
    e.stopPropagation();
    alert('del1');
    this.props.onDel(this.props.item);
  }

  pick(e: Object) {
    e.stopPropagation();

    this.props.onPick(this.props.item);
  }

  render() {
    return (
      <div className="img-item4picker" onClick={this.pick.bind(this)}>
        <div className="img-item-inner">
          <img
            src={this.props.item.url}
            alt={this.props.item.name} />
          <i className="img-operation icon icon-del-dot" onClick={this.del.bind(this)}></i>
        </div>
      </div>
    )
  }
}
