var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
/* GET users listing. */
router.get('/admin', function(req, res, next) {
  res.render('admin',{user:req.session.user,company:req.session.company});
});

router.get('/user', function(req, res, next) {
  res.render('user',{user:req.session.user,company:req.session.company});
});

router.get('/user2', function(req, res, next) {
  res.render('user2',{user:req.session.user,company:req.session.company});
});

router.post('/changePassword', function(req, res, next) {
  var condition = {
    userId:req.session.user.userId
  };
  var update = {
    $set:{
      password:req.body.password_new1,
    }
  };
  UserModel.findOne(condition,function(err,doc){
    if(doc.password == req.body.password_old){
      UserModel.update(condition,update,function(err,docs){
        if(!err){
          req.session.user.password = req.body.password_new1;
          req.session.user.changePasswordCount = null;
          res.send({
            ret:true
          });
        }
      })
    }else{
      if(req.session.user.changePasswordCount){
        req.session.user.changePasswordCount ++;
      }else{
        req.session.user.changePasswordCount = 1      
      }
      if(req.session.user.changePasswordCount>=3){
        req.session.user = null;
        res.send({
          ret:false,
          msg:'连续3次输入错误，重新登录!',
          action:'/'
        });
      }else{
        res.send({
          ret:false,
          msg:'密码错误，请稍后再试!'
        });
      };
    }
  })  
});

router.post('/add/user',function(req,res,next) {
  var record = req.body;
  if(record.role==0||record.role==1){
    res.send("无权限!");
    return;
  }
  var entity = new UserModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
})

router.post('/update/user',function(req,res,next) {
  var condition = {
    userId:req.body.userId
  };
  var update = {
    $set:{
      password:req.body.password,
      userName:req.body.userName,
      effective:req.body.effective
    }
  };
  UserModel.findOne(condition,function(err,doc){
    if(doc.companyId == req.session.user.companyId){
      UserModel.update(condition,update,function(err,docs){
        res.send('update success');
      })
    }else{
      res.send('无权限!');
    }
  })
})

router.post('/delete/user',function(req,res,next) {
  var condition = {
    userId:req.body.userId
  }
  UserModel.findOne(condition,function(err,doc){
    if(doc.companyId == req.session.user.companyId){
      UserModel.remove(condition,function(err,count){
        res.send('delete success')
      })
    }else{
      res.send('无权限!');
    }
  })
  
})

router.post('/add/admin',function(req,res,next) {
  var record = req.body;
  var entity = new UserModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
})

router.post('/update/admin',function(req,res,next) {
  var condition = {
    userId:req.body.userId
  };
  var update = {
    $set:{
      password:req.body.password,
      userName:req.body.userName,
      effective:req.body.effective
    }
  };
  UserModel.update(condition,update,function(err,docs){
    res.send('update success');
  })
})

router.post('/delete/admin',function(req,res,next) {
  var obj = {
    userId:req.body.userId
  }
  UserModel.remove(obj,function(err,count){
    res.send('delete success')
  })
})

router.get('/find',function(req,res,next) {
  var query = new Query({
    param:{
      userName: new RegExp(req.query.userName),
      companyPath:new RegExp('^' + req.session.user.companyPath),
      userId:new RegExp(req.query.userId)
    },
    model:UserModel,
    page:req.query
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.get('/find/company',function(req,res,next) {
  var query = new Query({
    param:{
      userName: new RegExp(req.query.userName),
      companyPath:new RegExp('^' + req.session.user.companyPath),
      userId:new RegExp(req.query.userId),
      role:2
    },
    model:UserModel,
    page:req.query
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.post('/find/autocomplete',function(req,res,next) {
  if(typeof req.body.ignoreUserIds == 'string'){
    req.body.ignoreUserIds = [req.body.ignoreUserIds]
  }else{
    req.body.ignoreUserIds = []
  }
  var param = {
    userName: new RegExp(req.body.name),
    companyId:req.session.user.companyId,
    role:2,
    userId:{
      $nin:req.body.ignoreUserIds
    }
  };
  var query = new Query({
    param:param,
    model:UserModel,
    page:req.body
  })
  query.query(function(err,result){
    if(err){
      console.log(err);
    }else{
      res.send(result);
    }
  });
})

router.get('/get',function(req,res,next) {
  res.send('get');
})

module.exports = router;
