var express = require('express');
var router = express.Router();
var cpUtil = require("./utils/cp-util");
var UserModel = require("./models/BlogModels").UserModel;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', function(req, res, next) {
  var body =  req.body ||{};
  var loginUser;
  if(body.nickname==="luanhaipeng" && body.email==="xiaozhu123!@coolpeng.cn"){
     loginUser ={
       nickname:"栾海鹏",
       username:"luanhaipeng",
       isLogin:true,
       isAdmin:true,
       role:"admin",
       avatar:"/public/static/images/avatar1.png",
       email:"910010653@qq.com"
     };
  }
  else if(body.nickname==="zhufengzhu" && body.email==="qq541tz@coolpeng.cn"){
    loginUser ={
      nickname:"朱凤珠",
      username:"zhufengzhu",
      isLogin:true,
      isAdmin:true,
      role:"admin",
      avatar:"/public/static/images/avatar2.jpg",
      email:"xxx@qq.com"
    };
  }
  else {

    loginUser ={
      nickname:body.nickname,
      username:body.nickname,
      isLogin:true,
      isAdmin:false,
      role:"guest",
      email:body.email
    };
  }


  UserModel.find({nickname:loginUser.nickname},function(err,doc){
    if(err){
      res.end(err.toString());
    }else {
      if(doc && doc.length>0){
        var u = doc[0];
        if(u.email!=loginUser.email && !loginUser.isAdmin){
          res.end("err_user_email")
        }else {
          UserModel.update({_id:u._id},{"$push":{"loginTimes":cpUtil.dataFormat()}},function(){

            req.session.loginUser =loginUser;
            res.end("ok");
          });
        }
      }else {
        var um =new UserModel(loginUser);
        um.save(um,function(){
          req.session.loginUser =loginUser;
          res.end("ok");
        });
      }
    }
  });



});


router.get('/logout', function(req, res, next) {

  req.session.loginUser ={
    nickname:"",
    username:"",
    isLogin:false,
    role:"guest"
  };

  res.end("ok");
});




module.exports = router;
