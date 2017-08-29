var SERVER = require('../constants/server');

var article = require('./Article');

/**
 * 删除元素
 * @param  {Object} e 原生的事件
 * @return
 */
function delEvent(e){

  e = e || window.event;
  $(e.target).remove($(e.target).text());
  article.removeKeyword()
}


function init(){
  article.clear();
  $.get(SERVER+'/articles/classes').then(function(result){
    var options = document.createDocumentFragment();
    result = JSON.parse(result);
    if(result.data.length){
      result.data.forEach(function(val){
        var newOption = '<option value = "'+val.id+'">'+val.name+'</option>';
        options.appendChild($(newOption)[0]);
      })
    }
    $('#article-class').append($(options)).change(function(e){
      e = e || window.event;
      article.setClassId(e.target.value)
    });
  },function(err){
    console.error(err);
  })
  var option = {
    autofocus: false,
    language: 'chs',
    saveable: true,
    onChange: function(e){
      if(e.getContent() !== article.getContent){
        article.setContent(e.getContent());
      }
    },
  };

  $('#article-content').markdown(option);

  $('#article-title').change(function(e){
    article.setTitle(e.target.value || '');
  });


  $('#article-publish').change(function(e){
    article.setPublish(e.target.checked);
  });

  $('#article-description').change(function(e){
    article.setDescription(e.target.value || '');
  })

  $('#article-save').click(function(e){
    $(e.target).attr('disabled',true);
    article.save().then(function(){
      $.pjax({url: '/admin/articles', container: '#content'})
    });
  });

  $('#add-keyword').click(function(e){
    $('#add-keyword-input').removeClass('hidden');
  });
  $('#add-keyword-input').keydown(function(e){
    e = e || window.event;
    if(e.keyCode != 13 || !e.target.value){
      return ;
    }
    var value = e.target.value,
        newEl = $('<div></div>'),
       currEl = $(e.target),
    currIndex = $('.article-keyword').length;

    //向标签列表插入新的
    newEl.addClass('label label-default article-keyword')
         .attr('data-key',currIndex)
         .text(value)
         .dblclick(delEvent);
    currEl.before(newEl).val('');
    article.setKeywords(value);
  });
  $('.article-keyword').dblclick(delEvent)
}

function initForEdit(id){

  function resolveInitVal(data){
    var title = data.title || '',
     keywords = data.keywords ? data.keywords.split(',') : [],
      content = data.content || '',
      publish = data.publish || false,
  description = data.description || '',
      classId = data.classId || '';
      id = data.id || '';

      //给各个组件赋初始值
      $('#article-title').val(title);
      $('#article-content').val(content);
      $('#article-publish').attr('checked',publish);
      $('#article-class').val(classId);
      $('#article-description').val(description);

      article.setTitle(title);
      article.setKeywords(data.keywords);
      article.setContent(content);
      article.setClassId(classId);
      article.setPublish(publish);
      article.setDescription(description);
      article.setId(id);

      keywords.forEach(function(val,index){
        var input = $('#add-keyword-input'),
            newEl = $('<div></div>');

        newEl.addClass('label label-default article-keyword')
             .attr('data-key',index)
             .text(val)
             .dblclick(delEvent);
        input.before(newEl);
      })

  }
  $.get(SERVER+'/articles/article/'+id).then(function(result){
    return JSON.parse(result);
  }, function(err){
    alert('网络异常！');
  }).then(function(result){
    if(result.error_code === 200){
      resolveInitVal(result.data);
    }
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
    'enter link description here': "输入链接描述",
    'Insert Hyperlink': "在这里加入超链接",
    'enter image description here': "输入图片描述",
    'Insert Image Hyperlink': "插入一个图片超链接",
    'enter image title here': "输入图片标题",
    'list text here': "列表文档"
  };
}(jQuery));
init();

var hrefArr = window.location.href.split('/');
if(hrefArr[hrefArr.length - 1] !== 'article'){
  initForEdit(hrefArr[hrefArr.length - 1]);
}
