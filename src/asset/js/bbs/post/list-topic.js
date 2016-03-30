import '../../../less/global/global.less';
import '../../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Post from './index';
import Loading from '../../loading/';
import Poptip from  '../../poptip/';
import LoadMore from '../../load-more/';
import GoTop from '../../gotop/';
import JWeiXin from '../../jweixin/';
import AH from '../../helper/ajax';
import {
  AllForums
} from '../model/';

export default class TopicPosts extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      qs: querystring.parse(location.search.substring(1)),
      f: 0,
      t: 30
    }

    new JWeiXin(() => {
      this.setState({
        wx_ready: true
      });
    });

    document.title = this.state.qs.topic;
  }

  componentDidMount() {
    this.ah = new AH(this.refs.loading, this.refs.poptip);

    this.query();

    LoadMore.init(() => {
      this.query();
    });
  }

  query() {
    this.ah.one(AllForums, (data) => {
      if (data && data.bbsForumList && data.bbsForumList.length) {
        this.formatForums(data.bbsForumList)

        this.setState({
          posts: this.state.f > 0 ? this.state.posts.concat(data.bbsForumList) : data.bbsForumList,
          f: this.state.f + data.bbsForumList.length
        });

        return;
      }

      if (this.state.posts.length) {
        this.refs.poptip.info('没有更多了');
      }
    }, {
      tid: this.state.qs.tid,
      f: this.state.f,
      t: 30
    });
  }

  formatForums(list: Array<Object>) {
    list.forEach((item) => {
      item.imgs = item.imgs_url ? item.imgs_url.split(';') : [];
    });
  }

  render() {
    return (
      <section className="topic-posts">
        <Post items={this.state.posts} wx_ready={this.state.wx_ready} />
        <GoTop />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<TopicPosts />, document.querySelector('.page'));
