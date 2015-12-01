import './index.less';

import React from 'react';

export default class Post extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="active-user">
        <h2 className="subtitle">人气用户</h2>
        <div className="active-users">
          <div className="row">
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
            <div className="avatar">
              <a href="#"><img src="" /></a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
