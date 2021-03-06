var orm  = require('orm');
var User = require('./User');
var Files = require('./File');
var Articles = require('./article');
var ArticleCls = require('./ArticleCls');
var Comment = require('./Comment');

module.exports = orm.express("mysql://root@127.0.0.1/leo_blog?characterEncoding=utf-8",{
  define: function (db, models, next) {
    models.User = User(orm,db);
    models.File = Files(orm,db);
    models.Article = Articles(orm,db);
    models.ArticleCls = ArticleCls(orm,db);
    models.Comment = Comment(orm,db);
    process.env.db = db;
    next();
}
});
