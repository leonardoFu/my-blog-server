module.exports = function(orm,db){
  return db.define('files',{
    id:{type:'text',required:true},
    name:String,
    size:Number,
    url:String,
    created_time:{type:'date',required:true}
  },{
    hooks:{
      beforeValidation:function(){
        this.created_time = new Date();
      }
    }
  })
};
