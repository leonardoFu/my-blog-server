var log4js = require('log4js');

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: 'log/access',
      pattern: '.yyyy-MM-dd',
      alwaysIncludePattern: true
    },
    stdout: {
      type: 'console'
    },
    error: {
      type: 'console'
    }
  },
  categories: {
    access: { appenders: ['access'], level: 'debug' },
    default: { appenders: ['stdout'], level: 'debug' },
    error: {appenders: ['error', 'access'], level: 'error'}
  }
})

var access = log4js.getLogger('access');
var defaultLog = log4js.getLogger();
exports.access = access;

exports.use = function(app) {
  app.use(log4js.connectLogger(access, { level: 'auto', format: ':method :url'}))
}
