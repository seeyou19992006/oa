var express = require('express');
var router = express.Router();
var CustomerModel = require('../models/customer');

router.get('/', function(req, res, next) {
  res.render('customer', {user:req.session.user});
});

router.get('/2', function(req, res, next) {
  res.render('customer2', {user:req.session.user});
});

router.post('/add',function(req,res,next) {
  var record = req.body;
  console.log(record.cellPhone);
  var $or = [];
  if(record.cellPhone){
    $or.push({cellPhone:record.cellPhone});
  }
  if(record.qqNumber){
    $or.push({qqNumber:record.qqNumber});
  }
  CustomerModel.findOne({$or:$or},function(err,doc){
    if(doc){
      res.send({
        ret:false,
        msg:'已存在相同的客户',
        data:doc
      });
    }else{
      record.userId = req.session.user.userId;
      record.userPath = req.session.user.companyPath;
      record.createTime = moment().format();
      record.companyId = req.session.user.companyId;
      var entity = new CustomerModel(record);
      entity.save(function(err,result){
        if(!err){
          res.send({
            ret:true,
            msg:'新增成功!'
          });
        }else{
          res.send({
            ret:false,
            msg:'数据库异常,新增失败!'
          });
        }
      });
    }
  })
})

router.post('/update',function(req,res,next) {
  var condition = {
    _id:req.body._id,
  }
  var update = {
    $set:{
      customerName:req.body.customerName,
      money:req.body.money,
      customerType:req.body.customerType,
      sex:req.body.sex,
      birthday:req.body.birthday,
      provinceName:req.body.provinceName,
      cityName:req.body.cityName,
      cellPhone:req.body.cellPhone,
      phone:req.body.phone,
      qqNumber:req.body.qqNumber,
      nickname:req.body.nickname,
      idCard:req.body.idCard,
      address:req.body.address,
      remark:req.body.remark
    }
  }
  CustomerModel.findOne(condition,function(err,doc){
    if(doc.userId==req.session.user.userId ||(req.session.user.role==1&& doc.companyId==req.session.user.companyId)){
      CustomerModel.update(condition,update,function(err,docs){
        res.send({ret:true});
      })
    }else{
      res.send({ret:false,msg:'无权限!'});
    }
  })
})

router.post('/delete',function(req,res,next) {
  var condition = {
    _id:req.body._id
  }
  CustomerModel.findOne(condition,function(err,doc){
    if(doc.userId == req.session.user.userId){
      CustomerModel.remove(condition,function(err,count){
        if(!err){
          res.send({ret:true});
        }else{
          res.send({ret:false,msg:'添加失败，请联系管理人员'});
        }
      })
    }else{
      res.send({ret:false,msg:'无权限!'});
    }
  })
})

router.get('/find',function(req,res,next) {
  if(req.query.customerType == 5 ||!req.query.customerType){
    req.query.customerType = [1,2,3,4];
  }else{
    req.query.customerType = [req.query.customerType];
  }
  var param = {
    userId:req.session.user.userId,
    customerName:new RegExp(req.query.customerName),
    customerType:{
      $in:req.query.customerType
    },
  }
  var sort = {};
  sort[req.query.field]  = (req.query.direction == 'ASC'?  1:-1 );
  console.log(sort);
  console.log(req.query.direction);
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:req.query,
    sort:sort
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.get('/find/company',function(req,res,next) {

  var param = {
    userId:req.query.userId,
    customerName:new RegExp(req.query.customerName),
    customerType:req.query.customerType,
  }
  if(!param.customerType){
    delete param.customerType;
  }
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:req.query
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.get('/find/preview',function(req,res,next) {
  var param = {}
  if(req.query.cellPhone){
    param.cellPhone = req.query.cellPhone;
  }else if(req.query.qqNumber){
    param.qqNumber = req.query.qqNumber;
  }
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:{
      start:0,
      limit:1
    }
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.get('/find/changeUser',function(req,res,next) {

  var param = {
    userId:req.query.fromUserId,
    //customerName:new RegExp(req.query.customerName),
    //customerType:req.query.customerType,
  }
  if(!param.customerType){
    delete param.customerType;
  }
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:req.query
  })
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  });
})

router.get('/find/companyStatistics',function(req,res,next) {

  var param = {
    companyId:req.session.user.companyId,
    customerName:new RegExp(req.query.customerName),
    customerType:req.query.customerType,
    createTime:{
      $gt:'2000-01-01 00:00:00',
      $lt:'2999-12-31 23:59:59'
    }
  }
  if(req.query.userId){
    param.userId=req.query.userId;
  }
  if(req.query.createTimeStart){
    param.createTime.$gt = moment(req.query.createTimeStart).format();
  }
  if(req.query.createTimeEnd){
    param.createTime.$lt = moment(req.query.createTimeEnd).format('YYYY-MM-DD 23:59:59');
  }

  if(!param.customerType){
    delete param.customerType;
  }
  var sort = {};
  sort[req.query.field]  = (req.query.direction == 'ASC'?  1:-1 );
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:req.query,
    sort:sort
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

router.post('/changeAll',function(req,res,next) {
  var fromUserId = req.body.fromUserId;
  var toUserId = req.body.toUserId;
  if(!toUserId){
    res.send({
      msg:'无目标员工',
      ret:false
    });
    return
  }
  CustomerModel.update({
    userId:fromUserId
  },{
    $set:{
      userId:toUserId
    }
  },{
    multi:true
  },function(err,count){
    console.log(count);
    res.send({
      ret:true,
    });
  })
})

router.post('/changeSelection',function(req,res,next) {
  var customerIds = req.body.customerIds;
  var toUserId = req.body.toUserId;
  if(!toUserId){
    res.send({
      msg:'无目标员工',
      ret:false
    });
    return
  }
  CustomerModel.update({
    _id:{$in:customerIds}
  },{
    $set:{
      userId:toUserId
    }
  },{
    multi:true
  },function(err,count){
    console.log(count);
    res.send({
      ret:true,
    });
  })
})



module.exports = router;