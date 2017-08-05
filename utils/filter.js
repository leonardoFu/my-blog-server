var FILTER_LIST = ['/admin/article','/admin'];

module.exports = function(req,res,next){
  var filterStr = FILTER_LIST.join(',');
  if(filterStr.indexOf(req.originalUrl) >= 0 && !req.session.user){
      res.redirect('/admin/login');

  }
  next();
};
