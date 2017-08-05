var log4js = require('log4js');

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: 'log/access',
      pattern: '.yyyy-MM-dd-hh',
      alwaysIncludePattern: true
    },
    errors: {
      type: 'console'
    }
  },
  categories: {
    access: { appenders: ['access'], level: 'debug' },
    default: { appenders: ['errors'], level: 'debug' }
  }
})

var access = log4js.getLogger('access');
var defaultLog = log4js.getLogger();
exports.access = access;

exports.use = function(app) {
  app.use(log4js.connectLogger(access, { level: 'auto', format: ':method :url'}))
}
