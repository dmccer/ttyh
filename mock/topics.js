exports.get = function(req, res) {
  res.json({
    list: [
      {
        id: 1,
        text: '经验分享'
      }, {
        id: 2,
        text: '实时路况'
      }
    ]
  })
}
