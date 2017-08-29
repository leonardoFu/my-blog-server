var FILTER_LIST = ['/user/adminlogin'];
var Result = require('./Result');

module.exports = function(req,res,next){
  var filterStr = FILTER_LIST.join(',');
  if(filterStr.indexOf(req.originalUrl) < 0 && !req.session.user){
      var result = new Result()

      result.failed().setMsg('未登录！')
      return res.end(result.toJSONString());

  }
  next();
};
