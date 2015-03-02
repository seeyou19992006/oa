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

router.get('/get',function(req,res,next) {
  res.send('get');
})

module.exports = router;
