var SERVER = require('../constants/server');

var articleList = {
  fetchData:function(pageNum,clsId){
    var params = {
      pageNum:pageNum,
      clsId:clsId
    };
    $.get(SERVER+'articles',params).then(function(result){
      console.log(result);
    },function(error){
      console.error(error);
    })
    return this;
  }
}

function init(){
  articleList.fetchData(1);
}
