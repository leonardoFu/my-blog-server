var FILTER_LIST = ['/user/adminlogin'];
var Result = require('./Result');

module.exports = function(req,res,next){
  var filterStr = FILTER_LIST.join(',');
  let isClient = req.headers.origin === 'http://127.0.0.1:8888';
  if(filterStr.indexOf(req.originalUrl) < 0 && !req.session.user && !isClient){
      var result = new Result()

      result.unLogged().setMsg('未登录！')
      return res.end(result.toJSONString());

  }
  next();
};
