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
  var entity = new CustomerModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
})

router.get('/update',function(req,res,next) {
  res.send('update');
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