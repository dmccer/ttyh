import React from 'react';
import ReactDOM from 'react-dom';

import AboutMeHeadBar from './head-bar/';
import Post from '../post/';

export default class AboutMe extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <section className="about-me">
        <AboutMeHeadBar />
        <Post />
      </section>
    )
  }
}

ReactDOM.render(<AboutMe />, $('#page').get(0))
