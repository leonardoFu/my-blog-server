var orm = require('orm');
var connection = null;

function setup(db) {
  var User  = db.load('./models/User', function(err){
    var User = db.models.bd_user;
  });
}

module.exports = function (cb) {
  
  if (connection) return connection;

  var opts = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '123456',
    protocol : 'mysql',
    database : 'leo_blog',
    port     : '3306',
    query    : { pool: true }
  };

  orm.connect(opts, function (err, db) {
    if (err) return cb(err);
    connection = db;
    setup(db);

    cb(null, db);
  });
};
