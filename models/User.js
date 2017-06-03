module.exports = function(orm,db){
  return db.define('bd_user', {
       id: { type: 'serial', key: true } , //主键
       username: String,
       password: String,
       avatar:String,
       nickname:String,
       sex:Number,
       mail:String,
   });
};
