var orm  = require('orm');
var User = require('./User');
var Files = require('./File');
var Articles = require('./article');
module.exports = orm.express("mysql://root@127.0.0.1/leo_blog?characterEncoding=utf-8",{
  define: function (db, models, next) {
    models.User = User(orm,db);
    models.File = Files(orm,db);
    models.Article = Articles(orm,db);
    next();
}
});
