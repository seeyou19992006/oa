var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
/* GET users listing. */
router.get('/admin', function(req, res, next) {
  res.render('admin',{user:req.session.user});
});

router.get('/user', function(req, res, next) {
  // res.render('',{user:req.session.user});
});

router.post('/add/user',function(req,res,next) {
  var record = req.body;
  var entity = new UserModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
})

router.post('/update/user',function(req,res,next) {
  res.send('update');
})

router.post('/delete/user',function(req,res,next) {
  res.send('delete');
})

router.post('/add/admin',function(req,res,next) {
  var record = req.body;
  var entity = new UserModel(record);
  entity.save(function(err,result){
  });
  res.send('add');
})

router.post('/update/admin',function(req,res,next) {
  res.send('update');
})

router.post('/delete/admin',function(req,res,next) {
  res.send('delete');
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
