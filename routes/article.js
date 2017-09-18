var CommentUtil = require('../utils/CommentUtil');
var Result = require('../utils/Result');

var async = require('async');
var express = require('express');
const logger = require('log4js').getLogger();
const errLogger = require('log4js').getLogger('error');
var uuidV1 = require('uuid/v1');
var router = express.Router();
/**
 * 新增/修改一篇文章
 */
router.post('/',function(req, res){
  var article = Object.assign({},req.body);

  article.publish = Number.parseInt(article.publish);
  var id = article.id;
  if (!id) {
    article.id = uuidV1();
    async.waterfall([
      function(callback) {
        req.models.Article.create(article, function(err){
          if(err) {
            return callback(err);
          }
          callback();
        })
      },
      function(callback) {
        req.models.ArticleCls.get(article.classId, function(err, articleCls) {
          if(err) {
            return callback(err);
          }
          if(articleCls.count) {
            articleCls.count++;
          }

          callback(null, articleCls);
        })
      },
      function(articleCls, callback) {
        articleCls.save(function(err) {
          if(err) {
            return callback(err);
          }
          callback();
        })
      }
    ],
    function(err) {
      var result = new Result();
      if(err) {
        errLogger.error(err.message);
        return res.end(result.failed().setMsg(err.message).toJSONString());
      }
      return res.end(result.success().setMsg('新增文章成功').toJSONString());
    });

  } else {
    async.waterfall([
      function(callback) {
        req.models.Article.get(id,function(err, old) {
          if(err) return callback(err);
          callback(null, old);
        })
      },
      function(oldArticle, callback) {
        old.save(Object.assign(old, article), function(err) {
          if(err) return callback(err);
          callback();
        })
      }
    ],
    function(err) {
      if(err) {
        errLogger.error(err.message);
        return res.end(result.failed().setMsg('修改文章失败！').toJSONString());
      }
      return res.end(result.success().setMsg('修改文章成功！').toJSONString());
    });
  }
});

router.get('/',function(req, res){
  var result = new Result();

  req.models.Article.find().all(function(err, items){
    logger.debug('query articles', new Date());
  return res.end(result.success().setData(items).toJSONString());
  })
});

/**
 * 获取一篇文章的信息
 */
router.get('/article/:id',function(req, res){
  var result = new Result();
  async.waterfall([
    function(cb){
      req.models.Article.get(req.params.id,function(err, article){
        cb(err, article);
      });
    },
    function(article, cb){
      if(article && article.classId){
        req.models.ArticleCls.get(article.classId, function(err, Cls){
          article.articleCls = Cls || {};
          cb(err, article);
        });
      }
    },
    function(article, cb){
      req.models.Comment.find({ article_id: req.params.id }, ['created_time', 'Z'], function(err, comments){
        article.comments = CommentUtil.generateReference(comments);
        cb(err, article);
      });
    }
  ], function(err, article){
      if(err){
        errLogger.error(err.message);
        return res.end(result.failed().setMsg(err.message).toJSONString());
      }
        return res.end(result.success().setData(article).toJSONString());
    })
});

/**
 * 删除文章
 */
router.delete('/article/:id',function(req,res) {
  var result = new Result();

  async.waterfall([
    function(callback) {
      req.models.Article.get(req.params.id,function(err,article) {
        if(err) return callback(err);
        callback(null, article);
      })
    },
    function(article, callback) {
      article.remove(function(err) {
        if(err) return callback(err);
        callback();
      })
    }
  ],
  function(err) {
    if (err) {
      errLogger.error(err.message);
      return res.end(result.failed().setMsg('删除文章失败').toJSONString());
    }
    return res.end(result.success().setMsg('删除成功').toJSONString());
  })
});

router.get('/classes',function(req, res){
  var result = new Result();
  req.models.ArticleCls.find().all(function(err, items){
    if (err) {
      throw err;
      return ;
    }
  return res.end(result.success().setData(items).toJSONString());
  })
});


router.get('/list',function(req, res){
  var result = new Result(),
       query = req.query,
        page = (query.pageNum - 1)*10,
        order = query.order,
        orderBy = query.orderBy;

  var param = {};
  if(query.classId) param = {classId: query.classId};
  var orderCond;
  if(order && orderBy) {
    orderCond = [orderBy, order === 'desc' ? 'Z' : 'A'];
  }
  async.parallel({
    total: function(callback) {
      req.models.Article.find(param).count(function(err,count){
        if(err) return callback(err);
        callback(null, count);
      })
    },
    articles: function(callback) {
      async.waterfall([
        function(callback2) {
          req.models.Article.find(param, orderCond || ['created_time', 'Z'])
            .limit(10)
            .offset(page)
            .run(function(err, articles){
              if(err) return callback2(err);

              var classIds;
              classIds = resolveClassIds(articles) || [];
              callback2(null, classIds, articles);
            })
        },
        function(classIds, articles, callback2) {
          req.models.ArticleCls.find().all(function(err, classes){
            if(err) return callback2(err);
            articles = articles.map(function(val){
              return Object.assign({}, val, {class: findCls(val.classId, classes)})
            })
            callback2(null, articles);
          })
        }
      ],
      function(err, result) {
        if(err) return callback(err);
        callback(null, result);
      })
    }
  }, function(err, results) {
    if(err) {
      errLogger.error(err.message);
      return res.end(result.failed().setMsg('查询文章失败').toJSONString());
    }
    return res.end(result.success().setData(results).toJSONString());
  })
});

/**
 * 新增一个文章分类
 */
router.post('/class', function(req, res){
  var result = new Result();
  var articleCls = Object.assign({}, req.body);
  if (!articleCls.id) {
    articleCls.id = uuidV1();
    req.models.ArticleCls.create(articleCls, function(err,newClass){
      if (err) {
        throw err;
      return res.end(result.failed().setMsg('新增文章分类失败！').toJSONString());
      } else {
      return res.end(result.success().setData(articleCls.id).setMsg('新增文章分类成功').toJSONString());
      }
    })
  }
});

router.get('/class/:id', function(req, res){
  var result = new Result();
  var id = req.param.id;

  req.models.ArticleCls.get(id, function(err, Cls){
    if(err) throw err;

  return res.end(result.success().setData(Cls).toJSONString());
  })
})

/**
 * 删除文章分类
 */
router.delete('/class/:id',function(req, res) {
  var result = new Result();
  var id = req.params.id;

  req.models.ArticleCls.get(id, function(err, Cls){
    if (err) throw err;

    Cls.remove(function(err){
      if (err) throw err;
      return res.end(result.success().setMsg('删除成功').toJSONString());
    })

  })
})

/**
 * 批量删除文章
 */
router.delete('/classes', function (req, res) {
  var result = new Result();
  var delIds = req.body || [];
  var countObj = {};
  async.waterfall([
    function(callback) {
      let articles = req.models.Article.find({id: delIds})
      articles.each(function(article) {
        if(countObj[article.classId]) {
          countObj[article.classId] ++;
        } else {
          countObj[article.classId] = 1;
        }
      });
      articles.remove(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, articles);
        }
      })
    },
    function(articles, callback) {

      req.models.ArticleCls.find({id: Object.keys(countObj)}).each(function(cls) {
        cls.count -= countObj[cls.id] || 0;
      }).save(function(err){
        callback(err);
      })
    },
    function(err) {
      if(err.length) {
        return res.end(result.failed().setMsg(err).toJSONString());
      }
      return res.end(result.success().setMsg('删除成功').toJSONString());
    }
  ])



})
/**
 * 新增评论
 */
router.post('/comment', function(req, res){
  var result = new Result();
  var newComment = Object.assign({}, req.body);
  newComment.id = uuidV1();
  async.series({
    findComments: function(callback) {
      req.models.Comment.create(newComment, function(err, item){
        if(err) return callback(err);
        callback();
      })
    },
    article: function(callback) {
      async.parallel({
        comments: function(callback2) {
          req.models.Comment.find({ article_id: newComment.article_id }, ['created_time', 'Z'], function(err, comments){
            if(err) return callback2(err);
            comments = CommentUtil.generateReference(comments);
            callback2(null, comments);
          })
        },
        article: function(callback2) {
          req.models.Article.get(newComment.article_id, function(err, article){
            if(err) return callback2(err);
            callback2(null, article);
          })
        }
      },
      function(err, results) {
        if(err) return callback(err);
        let article = Object.assign(results.article, { comments: results.comments });
        callback(null, article);
      })
    }
  },
  function(err, results) {
    if(err) {
      errLogger.error(err.message);
      return res.end(result.failed().setMsg(err.message).toJSONString())
    }
    return res.end(result.success().setData(results.article).toJSONString());
  });
});

function resolveClassIds(articles){
  if (!articles) {
    return;
  }
  return articles.map(function(val){
    return val.id;
  })
}

function findCls(id,classes){
  var result ;
  classes.forEach(function(val){
    if(val.id === id){
      result = val;
    }
  })
  return result || {};
}
module.exports = router;
