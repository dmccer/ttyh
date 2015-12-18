import '../../less/global/global.less';
import termText from 'raw!./term.txt';

import React from 'react';
import ReactDOM from 'react-dom';

export default class TermPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    let text = termText.replace(/\\n\\t/g, '<br /><br />');

    return (
      <div dangerouslySetInnerHTML={{__html: text }}></div>
    )
  }
}

ReactDOM.render(<TermPage />, $('#page').get(0));
