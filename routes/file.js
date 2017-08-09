var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'public/' });
var fs = require('fs');
const uuidV1 = require('uuid/v1');
var Result = require('../utils/Result');
//上传
router.post('/', upload.single('avatar'), function (req, res, next) {
  console.log(req.file)
  let originPath = req.file.destination+req.file.filename;
  let distPath =  'public/images/'+req.file.filename+'.'+req.file.originalname.split('.')[1];
  fs.rename(originPath,distPath,function(){
    var fileId = uuidV1();
    var newFile = {
      id:fileId,
      name:req.file.originalname,
      size:req.file.size,
      url:'images/'+req.file.filename+'.'+req.file.originalname.split('.')[1]
    }
    req.models.File.create(newFile,function(err,items){
      var result = new Result();
      if(err){
        result.failed().setMsg('新增文件失败！');
      return res.end(JSON.stringify(result));
        return;
      }
      result.success().setData({
        fileId,
        file:{
          name:items.name,
          url:items.url
        }
      })
    return res.end(JSON.stringify(result));
    });

  });
})

router.delete('/',function(req,res){
  //首先从数据库表里删除一行
  req.models.File.find({url:req.body.url}).remove(function(err){
    var result = new Result();
    res.setHeader('content-type','application/json;charset=utf-8');
    if (err){
    return res.end(JSON.stringify(result.faild().setMsg(err)));
      return;
    }
    var filePath = 'public/'+req.body.url;
    //如果文件实际存在，再从硬盘上删除
    fs.exists(filePath,function(exist){
      if(exist){
          fs.unlink(filePath);
      }
      return res.end(JSON.stringify(result.success()));
    })

  })
});

module.exports = router;
