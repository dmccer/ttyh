exports.post = function(req, res) {
  setTimeout(function() {
    res.json({
      code: 0,
      msg: '发布成功'
    });
  }, 2000)
}
