var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session')
var mongoose = require('mongoose');
require('./models/User')
mongoose.connect('mongodb://localhost/marathoners')
var User = mongoose.model('User')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/charts', express.static(__dirname + '/node_modules/angular-chart.js/dist/'));
app.use('/otherCharts', express.static(__dirname + '/node_modules/chart.js/'));
app.set('view engine', 'ejs')
app.use(session({ secret: 'marathonersappsecret', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/', routes);
app.use('/user', users);

//Passport stuff
var LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(function(email, password, done) {
  process.nextTick(function() {
    console.log(email);
    User.findOne({
      'account.email': email,
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/auth' }),
  function(req, res) {
    res.redirect('/home');
  });

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

module.exports = app;
