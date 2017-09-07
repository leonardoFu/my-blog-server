var express = require('express');
var router = express.Router();
var uuidV1 = require('uuid/v1');
var Result = require('../utils/Result');
var CommentUtil = require('../utils/CommentUtil');
var async = require('async');
/**
 * 新增/修改一篇文章
 */
router.post('/',function(req, res){
  var article = Object.assign({},req.body);
  var result = new Result();
  article.publish = Number.parseInt(article.publish);
  var id = article.id;
  if (!id) {
    article.id = uuidV1();

    req.models.Article.create(article, function(err){
      if (err) {
        throw err;
      return res.end(result.failed().setMsg('新增文章失败！').toJSONString());
      }else{
        if(article.classId){
          function cb(error, Cls){
              Cls.count++;
              Cls.save(function(err){
              if(err) throw err;
              console.log('新增分类成功');

            })
          };
          req.models.ArticleCls.get(article.classId, cb)
        }
      return res.end(result.success().setMsg('新增文章成功').toJSONString());
      }
    })
  } else {
    　req.models.Article.get(id,function(err, old){
        if (err) {
          throw err;
        return res.end(result.failed().setMsg('修改文章失败！').toJSONString());
        }
        old.save(article,function(err){
          if (err) throw err;
        return res.end(result.success().setMsg('修改文章成功！').toJSONString());
        })

      })
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
    return res.end(result.failed().setMsg(err.message).toJSONString());
    }
    return res.end(result.success().setData(article).toJSONString());
  })
});

/**
 * 删除文章
 */
router.delete('/article/:id',function(req,res){
  var result = new Result();

  req.models.Article.get(req.params.id,function(err,article){
    if (err) {
      throw err;
    return res.end(result.failed().setMsg('删除文章失败').toJSONString());
      return;
    }
    article.remove(function(err){
      if (err) {
        throw err;
      return res.end(result.failed().setMsg('删除文章失败').toJSONString());
        return;
      }
    return res.end(result.success().setMsg('删除成功').toJSONString());
    })
  })
})

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
        orderBy = query.orderBy,
       total = 0;
  var param = {};
  if(query.classId) param = {classId: query.classId};
  req.models.Article.find(param).count(function(err,count){
    total = count;
  })
  var orderCond;
  if(order && orderBy) {
    orderCond = [orderBy, order === 'desc' ? 'Z' : 'A'];
  }

  req.models.Article.find(param, orderCond || ['created_time', 'Z'])
    .limit(10)
    .offset(page)
    .run(function(err, articles){

      if (err) {
        throw err;
      return res.end(result.failed().setMsg('查询文章失败').toJSONString());
      }
      var classIds;
      classIds = resolveClassIds(articles) || [];
      req.models.ArticleCls.find().all(function(err, classes){
        console.log(err);
        console.log(classes);
        articles = articles.map(function(val){
          return Object.assign({}, val, {class: findCls(val.classId, classes)})
        })
      return res.end(result.success().setData({
          total:total,
          articles:articles
        }).toJSONString());
      })
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
router.delete('/class/:id',function(req, res){
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
 * 新增评论
 */
router.post('/comment', function(req, res){
  var result = new Result();
  var newComment = Object.assign({}, req.body);
  newComment.id = uuidV1();
  req.models.Comment.create(newComment, function(err, item){
    if(err) {
      return res.end(result.failed().setMsg('评论失败').toJSONString())
      throw err;
    }
    req.models.Comment.find({ article_id: newComment.article_id }, ['created_time', 'Z'], function(err, comments){
      if(err){
        throw err;
      }
      comments = CommentUtil.generateReference(comments);
      req.models.Article.get(newComment.article_id, function(err, article){
        article.comments = comments;
        return res.end(result.success().setData(article).toJSONString());
      })
    })

  })
})

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
