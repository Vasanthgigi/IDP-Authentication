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
const GitHubStrategy = require('passport-github').Strategy;

var app = express();

app.use(session({
  secret: 'IDP',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Facebook

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

//Linkedln
passport.use(new LinkedInStrategy({
  clientID: "86bcjuuyav3p0y",
  clientSecret: "iSwNCgHi4R2AdIFX",
  callbackURL: "http://18.188.70.2:3000/",
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


 //Github
 passport.use(new GitHubStrategy({
  clientID: "7b0c8e9ce17515cb19d1",
  clientSecret: "c484bc0c2ca834228651bd0509d0331284cda969",
  callbackURL: "http://18.188.70.2:3000/",
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

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
