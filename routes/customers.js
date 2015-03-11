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
  record.userId = req.session.user.userId;
  record.userPath = req.session.user.companyPath;
  record.createTime = new Date().format('yyyy-MM-dd hh:mm:ss');
  var entity = new CustomerModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
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