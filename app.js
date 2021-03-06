//test
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');

require('./dateFormat');

global.mongoose = require('mongoose');
global.db = mongoose.createConnection('mongodb://tony:abc123@localhost:27017/oa');
global.Query = require('./models/query.js');
global._ = require('underscore');
global.moment = require('moment');
moment.defaultFormat='YYYY-MM-DD HH:mm:ss';

var routes = require('./routes/index');
var users = require('./routes/users');
var companys = require('./routes/companys');
var customers = require('./routes/customers');
var traceRecords = require('./routes/traceRecords');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());

app.use(session({
  cookie: { maxAge: 2 * 60 * 60 * 1000   },
  secret: settings.cookieSecret,
  store: new MongoStore({
      db: settings.db,
  }),
}));

var ignoreArray = [
  '/',
  '/login',
  '/login/ajax'
];
app.use(function(req,res,next){
  if(!req.session.user && ignoreArray.indexOf(req.originalUrl) < 0 ){
    res.redirect('/');
  }else{
    console.log(req.session.cookie.expires);
    next();
  }
});
app.use('/', routes);
app.use('/users', users);
app.use('/companys',companys);
app.use('/customers',customers);
app.use('/traceRecords',traceRecords);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



app.use(function(req, res, next){
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;
 
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});



module.exports = app;
