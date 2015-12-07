import './index.less';

import React from 'react';

export default class EmojPicker extends React.Component {
  constructor() {
    super();

    this.state = {
      emojs: [
        {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }, {
          id: 1
        }, {
          id: 2
        }, {
          id: 2
        }
      ]
    }
  }

  pick(emoj: Object, e: Object) {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPick(emoj);
  }

  render() {
    let emojList = this.state.emojs.map((emoj, index) => {
      return <a
        href="#"
        key={'emoj-item_' + index}
        onClick={this.pick.bind(this, emoj)}>{index}</a>
    });

    return (
      <div className="emoj-list">
        {emojList}
      </div>
    )
  }
}
