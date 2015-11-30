import React from 'react';

import Praise from './item';

export default class PraiseList extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ul className="praise-list">
        <Praise />
        <Praise />
        <Praise />
        <Praise />
        <Praise />
      </ul>
    )
  }
}
