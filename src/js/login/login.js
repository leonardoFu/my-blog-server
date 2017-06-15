var params = {
  username:'',
  password:''
}

$('[name=username]').change(function(e){
  params.username = e.target.value||'';
})
$('[name=password]').change(function(e){
  params.password = e.target.value||'';
})
$('#login-button').click(function(e){
  e.preventDefault();
  $.post('/user/adminlogin',params).then(function(result){
    result = JSON.parse(result);
    if(result.error_code === 200){
      console.log('登录成功')
       window.location = "http://127.0.0.1:3000/admin"
    }
  })
})
