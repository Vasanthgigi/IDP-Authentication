var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done)
 {
   debugger;
   console.log('Hello world3');

  done(null, user);
});

passport.deserializeUser(function(user, done) 
{
  debugger;
  console.log('Hello world2');

  done(null, user);
});

console.log('Hello world1');


passport.use(
  new FacebookStrategy(
    {
      clientID: '253621498997615',
      clientSecret: '9d9371f64a16f4a1db81628a9a71efc8',
      callbackURL: 'http://18.188.70.2:443/'
    },
    function(accessToken, refreshToken, profile, cb) {
      //console.log('profile', profile);
      console.log('Hello world');

      debugger;
      return cb(null, profile);
    }
  )
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    debugger;
    console.log('Hello world');
    console.log('req', req.user);
    res.render('data', {
      user: req.user
    });
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
