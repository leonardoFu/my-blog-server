module.exports = function(orm,db){
  return db.define('articlecls',{
    id:{type:'text',required:true,key:true},//文章主键
    name:String
  })
};
