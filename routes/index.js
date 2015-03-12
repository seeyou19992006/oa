var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');
var CompanyModel = require('../models/company');
var CustomerModel = require('../models/customer');
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
            res.redirect('/companys/2');
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

router.get('/statistics/user',function(req,res,next){
  res.render('statisticsUser',{user:req.session.user});
})
router.get('/statistics/user/find',function(req,res,next){
  //今天
  var result = [
    {time:'今天'},
    {time:'本周'},
    {time:'本月内'},
    {time:'三个月内'},
    {time:'半年内'},
    {time:'半年'},
    {time:'今年'},
    {time:'一年内'},
    {time:'总共'}
  ];
  var completeFlag = 0;
  var sendResult = function(){
    if(completeFlag == 2 *1){
      res.send({data:result});
    }
  }
  var traceTodayPhoneParam = {
    traceTime:{$gt:new Date().format('yyyy-MM-dd 00:00:00')},
    traceType:1,
  }
  TraceRecordModel.count(traceTodayPhoneParam,function(err,count){
    result[0].phone = count;
    sendResult(completeFlag++);
  });
  var traceTodayVideoParam = {
    traceTime:{$gt:new Date().format('yyyy-MM-dd 00:00:00')},
    traceType:2,
  }
  TraceRecordModel.count(traceTodayVideoParam,function(err,count){
    result[0].video = count;
    sendResult(completeFlag++);
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
      traceTimeParam.$gt = req.query.traceTimeStart+' 00:00:00';
    }else{
      traceTimeParam.$gt = '2000-01-01 00:00:00';
    }
    if(req.query.traceTimeStart){
      traceTimeParam.$lt = req.query.traceTimeEnd +'23:59:59';
    }else{
      traceTimeParam.$lt = '2999-12-31 23:59:59';
    }

    var completeFlag = 0;
    var merge = function(result,arr1,arr2){
      for(var i = 0 ;i <arr1.length ; i ++){
        arr1[i].customerCount = arr2[i].customerCount;
      }
      result.data = arr1;
      res.send(result);
    }
    var customerReturnResult = [];
    var traceReturnResult = [];
    CustomerModel.collection.group(
      {userId:true},
      {
        userId:{$in:userIds},
        createTime:traceTimeParam
      },
      {count:0},
      function(obj,prev){
        prev.count++;
      },
      function(err,data){
        console.log(data);
        console.log(userIds);
        var returnResult = customerReturnResult;
        for(var i = 0;i<result.data.length;i++){
          returnResult.push(result.data[i].toObject());
        }
        for(var i =0 ; i< data.length;i ++){
          var index = userIdMap[data[i].userId];
          returnResult[index].customerCount = data[i].count;
        }
        //result.data = returnResult;
        completeFlag++;
        if(completeFlag==2){
          merge(result,traceReturnResult,customerReturnResult);
        }
      }
    );
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
        var returnResult = traceReturnResult;
        for(var i = 0;i<result.data.length;i++){
          returnResult.push(result.data[i].toObject());
        }
        for(var i =0 ; i< data.length;i ++){
          var index = userIdMap[data[i].userId];
          returnResult[index].count = data[i].count;
        }
        //result.data = returnResult;
        completeFlag++;
        if(completeFlag==2){
          merge(result,traceReturnResult,customerReturnResult);
        }
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
