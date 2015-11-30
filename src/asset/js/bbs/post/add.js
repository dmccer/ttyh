import '../../../less/global/form.less';
import './add.less';

import React from 'react';
import ReactDOM from 'react-dom';

import ResPicker from '../res-picker/';

export default class PostAdd extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="post-add">
        <form className="form">
          <div className="control post-title">
            <input type="text" placeholder="标题" />
            <span className="char-count">0/20</span>
          </div>
          <div className="post-body">
            <div className="control">
              <textarea refs="textarea" className="post-text" placeholder="正文"></textarea>
              <span className="char-count">0/2000</span>
            </div>
            <div className="control publish">
              <button className="btn teal">发布</button>
            </div>
          </div>
          <ResPicker />
        </form>
      </section>
    )
  }
}


ReactDOM.render(<PostAdd />, $('#page').get(0));
