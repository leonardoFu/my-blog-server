var express = require('express');
var router = express.Router();

router.get('/article',function(req,res){
  res.render('article');
});
router.get('/',function(req,res){
  res.render('index', { title: '管理系统' });
});
router.get('/login',function(req,res){
  res.render('login');
})
router.get('/articles',function(req,res){
  res.render('articleList');
})
module.exports = router;
