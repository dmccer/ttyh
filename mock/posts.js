exports.get = function(req, res) {
  res.json({
    list: [
      {
        id: 12222,
        user: {
          nickname: '秋末',
          avatar: 'http://img0.ph.126.net/Qp9eiBSvEA9wSwxfvulzZw==/6619399748304939789.jpg'
        },
        time: '1分钟前',
        comment_count: 12,
        praise_count: 20,
        title: '饼脸MG',
        text: '你眼中的秋末，是什么样子的？一件温暖的毛衣，一个咖啡馆里的下午，还是一个爱你的人？',
        imgs: [
          {
            thumbnail: 'http://img1.ph.126.net/vNrYyhUct90fiPOP5mOOuw==/6631442699166157036.jpg',
            large: 'http://img1.ph.126.net/vNrYyhUct90fiPOP5mOOuw==/6631442699166157036.jpg'
          },
          {
            thumbnail: 'http://img2.ph.126.net/Dm7cMlLc35IJL1thmdrJvQ==/6631265677794052961.jpg',
            large: 'http://img2.ph.126.net/Dm7cMlLc35IJL1thmdrJvQ==/6631265677794052961.jpg'
          },
          {
            thumbnail: 'http://img1.ph.126.net/WX6FsmHCtgTo_FUThVI87Q==/6631227194887084297.jpg',
            large: 'http://img1.ph.126.net/WX6FsmHCtgTo_FUThVI87Q==/6631227194887084297.jpg'
          },
          {
            thumbnail: 'http://img0.ph.126.net/sc4hbbruO4BppejsGDs2gA==/6631445997701040378.jpg',
            large: 'http://img0.ph.126.net/sc4hbbruO4BppejsGDs2gA==/6631445997701040378.jpg'
          }
        ]
      }, {
        id: 1223,
        user: {
          nickname: '清.私',
          avatar: 'http://img1.ph.126.net/YVhlXvqwYBnDKAWPtLRCog==/6630642254699504296.jpg'
        },
        time: '3分钟前',
        title: '带你越过山与海',
        text: '时光会老 旅行未完待续  你是唯一。我拿起相机，你推开门窗，山川与大海，风景不过你。',
        imgs: [
          {
            thumbnail: 'http://img1.ph.126.net/B2L9YMoeutlTSfjftj2NNw==/6631226095375612333.jpg',
            large: 'http://img1.ph.126.net/B2L9YMoeutlTSfjftj2NNw==/6631226095375612333.jpg'
          },
          {
            thumbnail: 'http://img1.ph.126.net/rOKv4qilYOsYwK94G5vJAg==/6631336046538371722.jpg',
            large: 'http://img1.ph.126.net/rOKv4qilYOsYwK94G5vJAg==/6631336046538371722.jpg'
          },
          {
            thumbnail: 'http://img2.ph.126.net/7F2n6clm-y9I_5LYuZmB_g==/6631285469003505881.jpg',
            large: 'http://img2.ph.126.net/7F2n6clm-y9I_5LYuZmB_g==/6631285469003505881.jpg'
          },
          {
            thumbnail: 'http://imgsize.ph.126.net/?imgurl=http://imghttp:.ph.126.net//img0.ph.126.net/IaDn4v2thEGiTC5XcOn5gA==/6631304160699613284.jpg_140x140x1.jpg',
            large: 'http://imgsize.ph.126.net/?imgurl=http://imghttp:.ph.126.net//img0.ph.126.net/IaDn4v2thEGiTC5XcOn5gA==/6631304160699613284.jpg_140x140x1.jpg'
          },
          {
            thumbnail: 'http://img0.ph.126.net/KFOQEMrK-h3nXhVJLy-ZKA==/6630763200980625438.jpg',
            large: 'http://img0.ph.126.net/KFOQEMrK-h3nXhVJLy-ZKA==/6630763200980625438.jpg'
          }
        ]
      }
    ]
  })
}

exports.post = function(req, res) {
  res.json({
    msg: '发布成功'
  })
}
