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
        praise_count: 20,
        reply_count: 3,
        floor: 1
      }, {
        id: 1223,
        user: {
          nickname: '清.私',
          avatar: 'http://img1.ph.126.net/YVhlXvqwYBnDKAWPtLRCog==/6630642254699504296.jpg'
        },
        time: '3分钟前',
        praise_count: 10,
        reply_count: 5,
        floor: 2
      },{
        id: 12222,
        user: {
          nickname: '秋末',
          avatar: 'http://img0.ph.126.net/Qp9eiBSvEA9wSwxfvulzZw==/6619399748304939789.jpg'
        },
        time: '1分钟前',
        praise_count: 20,
        reply_count: 3,
        floor: 3
      }, {
        id: 1223,
        user: {
          nickname: '清.私',
          avatar: 'http://img1.ph.126.net/YVhlXvqwYBnDKAWPtLRCog==/6630642254699504296.jpg'
        },
        time: '3分钟前',
        praise_count: 10,
        reply_count: 5,
        floor: 4
      },{
        id: 12222,
        user: {
          nickname: '秋末',
          avatar: 'http://img0.ph.126.net/Qp9eiBSvEA9wSwxfvulzZw==/6619399748304939789.jpg'
        },
        time: '1分钟前',
        praise_count: 20,
        reply_count: 3,
        floor: 5
      }, {
        id: 1223,
        user: {
          nickname: '清.私',
          avatar: 'http://img1.ph.126.net/YVhlXvqwYBnDKAWPtLRCog==/6630642254699504296.jpg'
        },
        time: '3分钟前',
        praise_count: 10,
        reply_count: 5,
        floor: 6
      }
    ]
  })
}
