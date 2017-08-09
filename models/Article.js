module.exports = function(orm, db){
  return db.define('articles', {
    id: {type:'text',required:true,key:true},//文章主键
    title: String,//文章标题
    content: String,//文章内容
    pv: Number,//浏览量
    comment_num: Number,//评价数量
    created_time: {type:'date',required:true},//创建时间
    last_modified_time: {type:'date'},//最后修改时间
    keywords: String,//关键字
    classId: String,//分类主键
    publish: Number,
    description: String,
  },{
    hooks:{
      beforeValidation:function(){
        if(!this.created_time){
          this.created_time = new Date();
        }else{
          this.last_modified_time = new Date();
        }
        this.pv = this.pv || 0;
        this.comment_num = this.comment_num || 0;
      }
    }
  })
};
