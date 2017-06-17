var express = require('express');
var router = express.Router();
var  uuidV1 = require('uuid/v1');
var Result = require('../utils/Result');


router.post('/',function(req,res){
  var article = Object.assign({},req.body);
  article.publish = Number.parseInt(article.publish);
  if(!article.id){
    article.id = uuidV1();
    req.models.Article.create(article,function(err){
      var result = new Result();
      if(err){
        throw err;
        res.end(result.failed().setMsg('新增文章失败！').toJSONString());
      }else{
        res.end(result.success().setMsg('新增文章成功').toJSONString());
      }
    })
  }
});
router.get('/',function(req,res){
  var result = new Result();
  req.models.Article.find().all(function(err,items){
    res.end(result.success().setData(items).toJSONString());
  })
});

router.post('/class',function(req,res){
  var result = new Result();
  var articleCls = Object.assign({},req.body);
  if(!articleCls.id){
    articleCls.id = uuidV1();
    req.models.ArticleCls.create(articleCls,function(err){
      if(err){
        throw err;
        res.end(result.failed().setMsg('新增文章失败！').toJSONString());
      }else{
        res.end(result.success().setMsg('新增文章成功').toJSONString());
      }
    })
  }
});
module.exports = router;
