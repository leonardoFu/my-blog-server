var SERVER = require('../constants/server');
var classNames = require('classnames');

var currentCls = '';
var articleList = {
  fetchCls: function(){
    return $.get(SERVER+'/articles/classes').then(function(result){
      return JSON.parse(result);
    })
  },
  refreshList: function(arr){
    this.clearList().initList(arr);
  },
  clearList: function(){
    $('.articles-list tbody').html('');
    return this;
  },
  initList: function(arr){
    var _this = this;
    if (!arr.length) {
      return;
    }
    var newList = document.createDocumentFragment();
    function formatDate(date){
      date = new Date(date);
      return date.getFullYear() +'-'+ (date.getMonth() + 1) +'-'+ date.getDate();
    }
    arr.forEach(function(value,index){
      var tr = $('<tr></tr>');
      tr.append($('<td>'+(index+1)+'</td>'))
        .append($('<td>'+value.title+'</td>'))
        .append($('<td>'+value.keywords+'</td>'))
        .append($('<td>'+formatDate(value.created_time)+'</td>'))
        .append($('<td>'+formatDate(value.last_modified_time)||''+'</td>'))
        .append($('<td>'+value.pv+'</td>'))
        .append($('<td><a class = "articles-editlink" href = ' +SERVER+'/admin/article/'
        +value.id+ '>编辑</a> <a class = "articles-dellink" href = "'+value.id+'">删除</a></td>'));
        newList.appendChild(tr[0]);
    });
    $('.articles-list tbody').append($(newList));

    $('.articles-editlink').click(function(e){
      e.preventDefault();
      var href = $(this).attr('href');;
      $.pjax({url:href, container: '#content'})
    });
    $('.articles-dellink').click(function(e){
      e.preventDefault();
      var articleId = $(e.target).attr('href');
      _this.removeArticle(articleId).then(function(result){

        if (result.error_code === 200) {
          _this.fetchData(1,currentCls).then(function(newData){

            if (newData.error_code === 200) {
              _this.refreshList(newData.data.articles);
              pagination.refresh(1,newData.data.total)
            }
          })
        }
      });
    })
  },
  fetchData: function(pageNum,clsId){
    currentCls = clsId || '';
    var params = {
      pageNum: pageNum,
    };
    if (clsId) params.classId = clsId;

    return $.get(SERVER+'/articles/list', params).then(function(result){
      return JSON.parse(result);
    },function(error){
      console.error(error);
    })
  },
  addClass: function(name){
    return $.post(SERVER+'/articles/class',{ name: name }).then(function(result){
      return JSON.parse(result);
    })
  },
  removeClass: function(classId){
    return $.ajax({
      url: SERVER+'/articles/class/'+classId,
      method: 'DELETE',
    }).then(function(result){
      return JSON.parse(result);
    });
  },
  removeArticle: function(articleId){
    return $.ajax({
      url: SERVER + '/articles/article/' + articleId,
      method: 'DELETE'
    }).then(function(result){
      return JSON.parse(result);
    })
  }
}

var pagination = {
  el:$('#articles-pagination'),
  clear: function(){
    $('.pagination').html('');

    return this;
  },
  init: function(current, total){
    var itemsNum = Math.ceil(total / 10);
    var pagiItems = document.createDocumentFragment();
    for(var i = 1; i <= itemsNum; i++){
      var newItem = $('<li class = "articles-pagitem"><a data-id = "' + i +
      '" href="#">' + i + '</a></li>');
      pagiItems.appendChild(newItem[0]);
    }

    $('.pagination').append($(pagiItems));
    $('.articles-pagitem:eq(0)').addClass('active');

    $('.articles-pagitem>a').click(function(e){
      e.preventDefault();
      e.stopPropagation();
      var pageNum = Number.parseInt($(this).attr('data-id'));
      articleList.fetchData(pageNum, currentCls)
        .then(function(result){
          if(result.error_code == 200){
            articleList.refreshList(result.data.articles);
          }
        })

      $('.articles-pagitem').removeClass('active');
      $('.articles-pagitem:eq('+(pageNum - 1)+')').addClass('active');

      return this;
    })
  },
  refresh: function(current,total){
    this.clear().init(current,total);
  }
}


function removeClick(e){
  e = e || window.event;
  e.stopPropagation();

  articleList.removeClass($(e.target).attr('data-id'));
}

function init(){

  articleList.fetchData(1).then(function(result){
    if(result.error_code == 200){
      articleList.initList(result.data.articles);
      pagination.init(1, result.data.total);
    }
  });
  articleList.fetchCls().then(function(result){
    if(result.error_code === 200){
      var list = document.createDocumentFragment();
      result.data.forEach(function(val){

        var removeClass = classNames('glyphicon','glyphicon-remove','articles-rmclass',{ hidden: val.count })

        var item = $('<li class = "articles-nav" data-id = "'+val.id+'"><span>'+val.name+
          '</span><i data-id = "'+val.id+'" class = "'+removeClass+'"></i></li>');

        $(list).append(item);

      });

      $('#articles-input').before($(list));

      $('i[data-id]').click(removeClick);
      $('li[data-id]').click(function(e){
        e = e || window.event;
        var classId = $(this).attr('data-id');
        articleList.fetchData(1,classId).then(function(result){
          if(result.error_code === 200){
            articleList.refreshList(result.data.articles);

            pagination.refresh(1,result.data.total);
          }
        });
      });
    }
  })

  $('.articles-addclass').click(function(){

    $('#articles-class-input').toggleClass('hidden').val('');
    $('.glyphicon-plus').toggleClass('glyphicon-remove');
  });
  $('#articles-class-input').keydown(function(e){
    e = e || window.event;
    var value = e.target.value,
           el = e.target;

    if(e.keyCode !== 13){
      return ;
    }

    articleList.addClass(value).then(function(result){

      if(result.error_code === 200){

        var newCls = $('<li data-id = "'+result.data+'"></li>')
          .addClass('articles-nav')
          .click(articleList.fetchData.bind(this, 1, result.data));
        var text = $('<span ></span>').html(value);

        var remove = $('<i data-id="'+result.data+'"></i>')
          .addClass('glyphicon glyphicon-remove articles-rmclass')
          .click(function(e){
             e = e || window.event;
             e.stopPropagation();
             articleList.removeClass($(e.target).attr('data-id'))
          });

        $('#articles-input').before(newCls.append(text).append(remove));

        $('#articles-class-input').toggleClass('hidden')
          .val('');

        $('.glyphicon-plus').removeClass('glyphicon-remove');
      }else{
        alert(result.errorMsg);
      }
    },function(error){
      alert(error);
    })

  })
}

init();
