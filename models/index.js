var orm  = require('orm');
var User = require('./User');
var Files = require('./File');
module.exports = orm.express("mysql://root:123456@127.0.0.1/leo_blog",{
  define: function (db, models, next) {
    models.User = User(orm,db);
    models.File = Files(orm,db);
    next();
}
});
