exports.get = function(req, res) {
  res.json({
    id: 12222,
    user: {
      nickname: '秋末',
      avatar: 'http://img0.ph.126.net/Qp9eiBSvEA9wSwxfvulzZw==/6619399748304939789.jpg'
    },
    followed: false,
    mine: false,
    time: '1分钟前',
    comment_count: 12,
    praise_count: 20,
    browse_count: 1001,
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
    ],
    address: '上海-浦东新区'
  })
}
