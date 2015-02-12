var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('test',{user:req.session.user});
});

router.post('/login', function(req, res, next) {
  var loginUser = req.body
  UserModel.findOne({userName:loginUser.userName},function(err,doc){
    if(loginUser.password == doc.password){
      req.session.user = doc;
      res.redirect('/companys');
    }else{
      res.redirect('/');
    }
  })
});

module.exports = router;
