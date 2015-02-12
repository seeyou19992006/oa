var express = require('express');
var router = express.Router();
var TraceRecordModel = require('../models/traceRecord');
/* GET traceRecords listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add',function(req,res,next) {
  var record = req.body;
  record.userId = req.session.user.userId;
  record.traceTime = new Date();
  var entity = new TraceRecordModel(record);
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
      customerId: req.query.customerId,
    },
    model:TraceRecordModel,
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
