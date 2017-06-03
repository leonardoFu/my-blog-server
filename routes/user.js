var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const uuidV1 = require('uuid/v1');
var Result = require('../utils/Result');
var _ = require('lodash');
var cookie = require('cookie');
router.post('/', function (req, res) {
  var user = Object.assign({},req.body);
  if(!user.id){
    const hash = crypto.createHash('md5');
    let MD5Pass = hash.update(user.password).digest('hex');
    user.password = MD5Pass;
    user.id = uuidV1();
    req.models.User.create(user,function(err,items){
      if(err){
        console.log(err);
        res.end(JSON.stringify(err),'utf-8');
      }else{
        console.log(items);
        res.end(JSON.stringify({
          error_code:200,
          message:'注册成功'
        }))
      }
    })
  }
})

router.get('/exists',function(req,res){
  console.log("请求携带的cookie");
  console.log(req.cookies);
  let {username} = req.query;
  res.setHeader('content-type','application/json;charset=utf-8');
  req.models.User.exists({username},(err,exists)=>{
    let result = new Result();
    if(err){
      res.end(JSON.stringify(result.failed().setMsg(err)));
      return;
    }
    res.end(JSON.stringify(result.success().setData({exists})));
  })
})

router.post('/login',function(req,res){
  let {username,password} = req.body;
  const hash = crypto.createHash('md5');
  let pass = hash.update(password).digest('hex');

  req.models.User.find({username}).all(function(err,items){
    let result = new Result();
    if(err){
      res.end(result.failed().setMsg('网络异常，请稍后重试').toJSONString());
    }else if(items.length<1){
      res.end(result.failed().setMsg('用户名或者密码错误').toJSONString());
    }else if(pass!=items[0].password){
      res.end(result.failed().setMsg('用户名或者密码错误').toJSONString());
    }else{
      var userData = _.omit(items[0],['avatar','password']);
      // var userCookie = cookie.serialize('user',)
      // console.log(userCookie);
      res.cookie('user',JSON.stringify(userData),{
        maxAge:20*60*1000,
        domain:'127.0.0.1'
      })
      res.end(result.success().setMsg('成功').toJSONString());
    }
  })
})

module.exports = router;
