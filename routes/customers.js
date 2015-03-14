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
    if(doc.userId==req.session.user.userId){
      CustomerModel.update(condition,update,function(err,docs){
        res.send('update success');
      })
    }else{
      res.send('无权限!');
    }
  })
})

router.get('/delete',function(req,res,next) {
  res.send('delete');
})

router.get('/find',function(req,res,next) {

  var param = {
    userId:req.session.user.userId,
    customerName:new RegExp(req.query.customerName),
    customerType:req.query.customerType,
  }
  if(!param.customerType){
    delete param.customerType;
  }
  var query = new Query({
    param:param,
    model:CustomerModel,
    page:req.query,
    sort:{
      _id:-1
    }
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

router.get('/get',function(req,res,next) {
  res.send('get');
})

module.exports = router;