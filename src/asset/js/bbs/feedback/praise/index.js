import React from 'react';

import Praise from './item';

export default class PraiseList extends React.Component {
  constructor() {
    super()
  }

  render() {
    let praiseList = this.props.items.map((item, index) => {
      return <Praise key={'praise_' + index} item={item} />
    })
    return (
      <ul className="praise-list">
        {praiseList}
      </ul>
    )
  }
}
