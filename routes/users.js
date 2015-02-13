var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',function(req,res,next) {
  var record = req.body;
  var entity = new UserModel(record);
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
  var query = new Query({
    param:{
      userName: new RegExp(req.query.userName),
      companyPath:new RegExp('^' + req.session.user.companyPath)
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
