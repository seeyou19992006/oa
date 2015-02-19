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

router.post('/update',function(req,res,next) {
  var condition = {
    id:req.body.id
  };
  var update = {
    $set:{
      remark:req.body.remark
    }
  };
  CompanyModel.update(condition,update,function(err,docs){
    res.send('update success');
  })
})

router.post('/delete',function(req,res,next) {
  if(req.body.path){
    var obj = {path:new RegExp('^' + req.body.path)};
    CompanyModel.find(obj,function(err,docs){
      if(docs.length == 1){
        CompanyModel.remove(obj,function(err,count){
          res.send('delete success!');
        })
      }else{
        res.send('delete faild!');
      }
      console.log(docs);
    });
  }else{
    res.send('bad request!');
  }
})

router.get('/find',function(req,res,next) {
  var query = new Query({
    param:{
      name:new RegExp(req.query.name),
      path:new RegExp('^' + req.session.user.companyPath),
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



