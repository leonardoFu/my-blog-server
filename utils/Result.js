var result = function(){
  this.error_code = '';
  this.data = {};
  this.message = '';

  this.success = function(){
    this.error_code = 200;
    return this;
  };
  this.failed = function(){
    this.error_code = 400;
    return this;
  };
  this.unLogged = function() {
    this.error_code = 401;
    this.message = '未登录！'
    return this;
  }
  this.setMsg = function(message) {
    this.message = message;
    return this;
  }
  this.setData = function(data) {
    this.data = data;
    return this;
  }
  this.addData = function(obj){
    this.data = Object.assign({},this.data,obj);
    return this;
  }
  this.toJSONString = function(){
    return JSON.stringify(this);
  }
}

module.exports = result;
