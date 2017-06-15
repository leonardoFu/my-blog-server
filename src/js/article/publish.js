var SERVER = require('../constants/server');



// var alert = {
//   el:$('#article-alert'),
//   setMsg:function(){
//
//   },
//   success:function(message){
//     this.
//   }
// }
function Article(){
  var title = '',
    content = '',
    publish = false;

    this.getContent = function(){
      return content;
    }
    this.getTitle = function(){
      return title;
    }
    this.getPublish = function (){
      return publish;
    }
    this.getArticle = function(){
      return {
        title:title,
        content:content,
        publish:publish
      }
    }
    this.setContent = function(str){
      content = str;
    }
    this.setTitle = function(str){
      title = str;
    }
    this.setPublish = function(bool){
      publish = bool?1:0;
    }
    this.save = function(){
      var params = this.getArticle();
      $.ajax({
        url:SERVER+'/articles',
        data:params,
        method:'POST'
      }).then(function(result){
        console.log(result);
      },function(err){
        console.error(err);
      })
    }
}

function init(){
  var article = new Article();
  var option = {
    autofocus:false,
    language:'chs',
    saveable:true,
    onChange: function(e){
      if(e.getContent()!==article.getContent){
        article.setContent(e.getContent());
      }
    },
  }
  $('#article-content').markdown(option);
  $('#article-title').change(function(e){
    article.setTitle(e.target.value);
  });
  $('#article-publish').change(function(e){
    article.setPublish(e.target.checked);
  })
  $('#article-save').click(function(e){
    $(e.target).attr('disabled',true);
    article.save();
  })
}


  (function($){
    $.fn.markdown.messages['chs'] = {
      'Bold': "粗体",
      'Italic': "斜体",
      'Heading': "标题",
      'URL/Link': "超链接",
      'Image': "图片",
      'List': "列表",
      'Preview': "预览",
      'strong text': "强调",
      'emphasized text': "texte souligné",
      'heading text': "texte d'entête",
      'enter link description here': "输入链接描述",
      'Insert Hyperlink': "在这里加入超链接",
      'enter image description here': "输入图片描述",
      'Insert Image Hyperlink': "插入一个图片超链接",
      'enter image title here': "输入图片标题",
      'list text here': "列表文档"
    };
  }(jQuery));
  init();
