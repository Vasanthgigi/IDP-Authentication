var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

var app = express();

app.use(session({
  secret: 'IDP',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done)
 {
  done(null, user);
});

passport.deserializeUser(function(user, done) 
{
  done(null, user);
});

console.log('Hello world1');


passport.use(
  new FacebookStrategy(
    {
      clientID: '253621498997615',
      clientSecret: '9d9371f64a16f4a1db81628a9a71efc8',
      callbackURL: 'https://18.188.70.2:443/'
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.render('data', {
      user: req.user
    });
  }
);

passport.use(new LinkedInStrategy({
  clientID: "86bcjuuyav3p0y",
  clientSecret: "iSwNCgHi4R2AdIFX",
  callbackURL: "https://18.188.70.2:443/",
  scope: ['r_emailaddress', 'r_liteprofile'],
},
function(token, tokenSecret, profile, done) {
  return done(null, profile);
}
));

app.get('/auth/linkedin',
passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// app.get('/auth/linkedin',
// passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));


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
