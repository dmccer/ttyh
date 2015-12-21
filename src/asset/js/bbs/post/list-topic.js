import '../../../less/global/global.less';
import '../../../less/global/layout.less';

import React from 'react';
import ReactDOM from 'react-dom';
import querystring from 'querystring';
import Post from './index';
import Loading from '../../loading/';

export default class TopicPosts extends React.Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      qs: querystring.parse(location.search.substring(1))
    }
  }

  componentDidMount() {
    this.refs.loading.show('加载中...');

    $.ajax({
      url: '/api/bbs_v2/show_all',
      type: 'GET',
      data: {
        tid: this.state.qs.tid
      },
      success: (data) => {
        this.refs.loading.close();

        this.formatForums(data.bbsForumList)

        this.setState({
          posts: data.bbsForumList
        });
      }
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
        <Post items={this.state.posts} />
        <Loading ref="loading" />
      </section>
    );
  }
}

ReactDOM.render(<TopicPosts />, $('#page').get(0));
