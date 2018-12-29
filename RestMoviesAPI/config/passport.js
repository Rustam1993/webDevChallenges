const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs');
const passport      = require('passport');

const User          = require('../models/User');



passport.serializeUser((loggedInUser, cb) =>{
  cb(null, loggedInUser)
});

passport.deserializeUser((userIdFromSession, cb) =>{
  User.findById(userIdFromSession, (err, user) =>{
    if(err) { return cb(err)}
    cb(null, user)
  })
});


passport.use(new LocalStrategy((username, password, next) =>{
  User.findOne({username} ,(err,user) =>{
    if(err) { return next(err)}
    if(!user) { 
      return next(null, false, { message: "Incorrect username" })
    }
    if(!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message : 'incorrect password'})
    }
    return next(null, user)
  })
}));