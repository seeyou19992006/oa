var express = require('express');
var router = express.Router();
var CompanyModel = require('../models/company');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('company',{user:req.session.user});
});

router.get('/2', function(req, res, next) {
  res.render('company2',{user:req.session.user});
});


router.post('/add',function(req,res,next) {
  var record = req.body;
  var entity = new CompanyModel(record);
  entity.saveWithNewId();
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
      name:new RegExp(req.query.name),
      //path:new RegExp('^' + req.session.user.companyPath),
    },
    model:CompanyModel,
    page:req.query
  });
  query.query(function(err,result){
    if(err){

    }else{
      res.send(result);
    }
  })
})

router.get('/get',function(req,res,next) {
  res.send('get');
})

module.exports = router;



