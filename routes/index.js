var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');
var CompanyModel = require('../models/company');
var TraceRecordModel = require('../models/traceRecord');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('test',{user:req.session.user});
});

router.post('/login', function(req, res, next) {
  var loginUser = req.body;
  UserModel.findOne({userId:loginUser.userName},function(err,user){
    if(user && loginUser.password == user.password){
      req.session.user = user;
      CompanyModel.findOne({id:user.companyId},function(err,company){
        req.session.company = company;
        switch(user.role){
          case 0:
            res.redirect('/companys');
            break;
          case 1:
            res.redirect('/users/user2');
            break;
          case 2:
            res.redirect('/customers/2');
        }
      });
    }else{
      res.redirect('/');
    }
  })
});

router.get('/statistics',function(req,res,next){
  res.render('statistics',{user:req.session.user});
})
router.get('/statistics/user/find',function(req,res,next){
  var query = new Query({
    param:{
      traceTime:{$gt:new Date(new Date().format('yyyy-MM-dd 00:00:00'))}
    }
  });
})
router.get('/statistics/company/find',function(req,res,next){
  var query = new Query({
    param:{
      companyId:req.session.user.companyId,
      role:2,
      userName:new RegExp(req.query.userName)
    },
    model:UserModel,
    page:req.query,
  })
  query.query(function(err,result){
    var userIds = [];
    var userIdMap = {};
    for(var i = 0;i<result.data.length;i++){
      userIds.push(result.data[i].userId);
      userIdMap[result.data[i].userId] = i;
    }
    var traceTimeParam = {};
    if(req.query.traceTimeStart){
      traceTimeParam.$gt = new Date(req.query.traceTimeStart);
    }else{
      traceTimeParam.$gt = new Date('2000-01-01');
    }
    if(req.query.traceTimeStart){
      traceTimeParam.$lt = new Date(req.query.traceTimeEnd);
    }else{
      traceTimeParam.$lt = new Date('2999-12-31');
    }
    TraceRecordModel.collection.group(
      {userId:true},
      {
        userId:{$in:userIds},
        traceTime:traceTimeParam
      },
      {count:0},
      function(obj,prev){
        prev.count++;
      },
      function(err,data){
        console.log(data);
        console.log(userIds);
        var returnResult = [];
        for(var i = 0;i<result.data.length;i++){
          returnResult.push(result.data[i].toObject());
        }
        for(var i =0 ; i< data.length;i ++){
          var index = userIdMap[data[i].userId];
          returnResult[index].count = data[i].count;
        }
        result.data = returnResult;
        res.send(result);
      }
    );
  });
  // res.render('statistics',{user:req.session.user});
})
router.get('/statistics/user/find',function(req,res,next){
  res.render('statistics',{user:req.session.user});
})

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/');
});

module.exports = router;
