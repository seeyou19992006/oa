var express = require('express');
var router = express.Router();

var UserModel = require('../models/user');
var CompanyModel = require('../models/company');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('test',{user:req.session.user});
});

router.post('/login', function(req, res, next) {
  var loginUser = req.body;
  UserModel.findOne({userId:loginUser.userName},function(err,user){
    if(user && loginUser.password == user.password){
      req.session.user = user;
      CompanyModel.findOne({id:user.companyId},function(err,company){
        req.session.company = company;
        switch(user.role){
          case 0:
            res.redirect('/companys');
            break;
          case 1:
            res.redirect('/users/user');
            break;
          case 2:
            res.redirect('/customers');
        }
      });
    }else{
      res.redirect('/');
    }
  })
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/');
});

module.exports = router;
