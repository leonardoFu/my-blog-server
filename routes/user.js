var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var uuidV1 = require('uuid/v1');
var Result = require('../utils/Result');
var _ = require('lodash');
var cookie = require('cookie');
var ccap = require('ccap');

let validateCode='';
router.post('/', function (req, res) {
  var user = Object.assign({},req.body);
  if(!user.id){
    var hash = crypto.createHash('md5');
    var MD5Pass = hash.update(user.password).digest('hex');
    user.password = MD5Pass;
    user.id = uuidV1();
    req.models.User.create(user,function(err,items){
      if(err){
        console.log(err);
        res.end(JSON.stringify(err),'utf-8');
      }else{
        res.end(JSON.stringify({
          error_code:200,
          message:'注册成功'
        }))
      }
    })
  }
})



router.get('/exists',function(req,res){
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

function generateCode(length = 4){
  const char = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F',
  'G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  let result =""
  for(let i = 0;i<length;i++){
    let pos = Math.ceil(Math.random()*35);
    result+=char[pos];
  }
  return result;
}
router.get('/valicode',function(req,res){
  let captcha = ccap({
    width:150,
    height:60,
    offset:30,
    quality:50,
    fontsize:40,
    generate:function(){
      return generateCode(4);
    }
  })
  arr = captcha.get();
  validateCode = arr[0];
  console.log(validateCode);
  res.write(arr[1]);
  res.end();
})
function checkValiCode(code=''){

  return  code.toLowerCase() === validateCode.toLocaleLowerCase();
}
router.post('/login',function(req,res){
  let error_time = req.cookies.error_time||0;
  let {username,password,validateCode} = req.body;
  const hash = crypto.createHash('md5');
  let pass = hash.update(password).digest('hex');

  req.models.User.find({username}).all(function(err,items){
    let result = new Result();
    if(error_time>2){
      if(!checkValiCode(validateCode)){
        return res.end(result.failed().setMsg('验证码错误！').toJSONString());
      }
    }
    if(err){
      res.end(result.failed().setMsg('网络异常，请稍后重试').toJSONString());
    }else if(items.length<1){
      error_time =error_time +1;
      res.cookie('error_time',error_time,{
        domain:'127.0.0.1'
      })
      res.end(result.failed().setMsg('用户名或者密码错误').toJSONString());
    }else if(pass!=items[0].password){

      error_time++;
      res.cookie('error_time',error_time,{
        domain:'127.0.0.1'
      })
      res.end(result.failed().setMsg('用户名或者密码错误').toJSONString());
    }else{
      var userData = _.omit(items[0],['password']);
      console.log(userData.avatar);
      req.models.File.find({id:userData.avatar},function(err,file){
        if(err) throw err;
        console.log(file)
        userData.avatar = file[0].url;
        res.cookie('user',JSON.stringify(userData),{
          maxAge:20 * 60 * 1000,
          domain:'127.0.0.1'
        })
        res.cookie('error_time',0,{
          domain:'127.0.0.1'
        })
        res.end(result.success().setMsg('登录成功').toJSONString());
      })
      // var userCookie = cookie.serialize('user',)
      // console.log(userCookie);
    }
  })
})

router.post('/adminlogin',function(req,res){
  var {username,password} = req.body;
  var result = new Result();
  if(username === 'leo' && password === 'leoadmin'){
    req.session.user = true;
    res.end(result.success().setMsg('登录成功').toJSONString());
  }else{
    res.end(result.failed().setMsg('用户名或密码错误！').toJSONString());
  }
})
module.exports = router;
