(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
      $.ajax({
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

},{"../constants/server":3}],2:[function(require,module,exports){
function delEvent(e){e=e||window.event,$(e.target).remove($(e.target).text()),article.removeKeyword()}function init(){article.clear(),$.get(SERVER+"/articles/classes").then(function(e){var t=document.createDocumentFragment();(e=JSON.parse(e)).data.length&&e.data.forEach(function(e){var r='<option value = "'+e.id+'">'+e.name+"</option>";t.appendChild($(r)[0])}),$("#article-class").append($(t)).change(function(e){e=e||window.event,article.setClassId(e.target.value)})},function(e){console.error(e)});var e={autofocus:!1,language:"chs",saveable:!0,onChange:function(e){e.getContent()!==article.getContent&&article.setContent(e.getContent())}};$("#article-content").markdown(e),$("#article-title").change(function(e){article.setTitle(e.target.value||"")}),$("#article-publish").change(function(e){article.setPublish(e.target.checked)}),$("#article-description").change(function(e){article.setDescription(e.target.value||"")}),$("#article-save").click(function(e){$(e.target).attr("disabled",!0),article.save()}),$("#add-keyword").click(function(e){$("#add-keyword-input").removeClass("hidden")}),$("#add-keyword-input").keydown(function(e){if(13==(e=e||window.event).keyCode&&e.target.value){var t=e.target.value,r=$("<div></div>"),a=$(e.target),i=$(".article-keyword").length;r.addClass("label label-default article-keyword").attr("data-key",i).text(t).dblclick(delEvent),a.before(r).val(""),article.setKeywords(t)}}),$(".article-keyword").dblclick(delEvent)}function initForEdit(e){function t(t){var r=t.title||"",a=t.keywords?t.keywords.split(","):[],i=t.content||"",n=t.publish||"",l=t.description||"",c=t.classId||"";e=t.id||"",$("#article-title").val(r),$("#article-content").val(i),$("#article-publish").attr("checked",i),$("#article-class").val(c),$("#article-description").val(l),article.setTitle(r),article.setKeywords(t.keywords),article.setContent(i),article.setClassId(c),article.setPublish(n),article.setDescription(l),article.setId(e),a.forEach(function(e,t){var r=$("#add-keyword-input"),a=$("<div></div>");a.addClass("label label-default article-keyword").attr("data-key",t).text(e).dblclick(delEvent),r.before(a)})}$.get(SERVER+"/articles/article/"+e).then(function(e){return JSON.parse(e)},function(e){alert("网络异常！")}).then(function(e){200===e.error_code&&t(e.data)})}var SERVER=require("../constants/server"),article=require("./Article");!function(e){e.fn.markdown.messages.chs={Bold:"粗体",Italic:"斜体",Heading:"标题","URL/Link":"超链接",Image:"图片",List:"列表",Preview:"预览","strong text":"强调","enter link description here":"输入链接描述","Insert Hyperlink":"在这里加入超链接","enter image description here":"输入图片描述","Insert Image Hyperlink":"插入一个图片超链接","enter image title here":"输入图片标题","list text here":"列表文档"}}(jQuery),init();var hrefArr=window.location.href.split("/");"article"!==hrefArr[hrefArr.length-1]&&initForEdit(hrefArr[hrefArr.length-1]);
},{"../constants/server":3,"./Article":1}],3:[function(require,module,exports){
var SERVER = 'http://127.0.0.1:3000'
module.exports = SERVER;

},{}]},{},[2])