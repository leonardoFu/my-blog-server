module.exports = function(orm, db){
  return db.define('comments', {
    id: {type: 'text',required: true,key: true},//评论主键
    article_id: {type: 'text', required: true},//文章主键
    text: {type: 'text', required: true},//评论内容
    reference_id: String,//引用评论
    username: {type: 'text', required: true},//评论人姓名
    link: String,//评论人博客地址
    created_time: {type: 'text', required: true},//创建时间
    user_email: {type: 'text', required: true},//评论人邮箱
  }, {
    hooks: {
    beforeValidation() {
      if(!this.created_time){
        this.created_time = new Date();
      }
    }
  }})
}
