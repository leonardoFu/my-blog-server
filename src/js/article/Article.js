
var SERVER = require('../constants/server');

function Article(){
  var title = '',
    content = '',
    publish = false,
    keywords = '',
    classId = '',
    id = '',
    description = '';
    this.getId = function(){
      return id;
    }
    this.getContent = function(){
      return content;
    };
    this.getTitle = function(){
      return title;
    };
    this.getPublish = function (){
      return publish;
    };
    this.getArticle = function(){
      return {
        title: title,
        content: content,
        publish: publish,
        keywords: keywords,
        classId: classId,
        id: id,
        description: description
      }
    };
    this.getDescription = function (){
      return  description;
    }
    this.setDescription = function (str){
      description = str;
    }
    this.getKeywords = function(){
      return keywords;
    }
    this.getClassId = function(){
      return classId;
    }
    this.setId = function(str){
      id = str;
    }
    this.setContent = function(str){
      content = str;
    };
    this.setClassId = function(str){
      classId = str;
    };
    this.setKeywords = function(str){
      if(keywords.includes(str)){
        return;
      }
      keywords = !keywords?str:keywords+','+str;
    };
    this.removeKeyword = function(str){
      var tempArr = keywords.split(','),
       delIndex = tempArr.indexOf(str);

      tempArr.splice(delIndex,1);
      keywords = tempArr.join(',');
    }
    this.clear = function(){
        title = '';
      content = '';
      publish = 0;
     keywords = '';
      classId = '';
      description = '';
    }
    this.setTitle = function(str){
      title = str;
    };
    this.setPublish = function(bool){
      publish = bool?1:0;
    };
    this.save = function(){
      var params = this.getArticle();
      return $.ajax({
        url:SERVER+'/articles',
        data:params,
        method:'POST'
      }).then(function(result){
        result = JSON.parse(result);
        alert(result.message||'');
      },function(err){
        console.error(err);
      })
    };
}

module.exports = new Article();
