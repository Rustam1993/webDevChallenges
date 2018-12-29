// Create read Update Delete

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const passport  = require('passport');

const User      = require('../models/User');

router.post('/create-user', (req,res,next) =>{
  User.findOne({username : req.body.username})
  .then((user) =>{
    if(user !==null) {
      res.json({message : 'username is already taken'})
      return;
    }
    
    const salt    = bcrypt.genSaltSync(10);
    const theHash = bcrypt.hashSync(req.body.password, salt)

    User.create({
      username : req.body.username,
      password : theHash
    })
    .then((user) =>{
      req.login(user, (err) =>{
        if(err) {
          res.status(500).json({message: 'Login after signup went bad'})
          return;
        }
        res.json(user)
      })
    })
    .catch((err) =>{
      res.json({message : 'something went wrong with creating'})
    })
  })
  .catch(err =>{
    res.json(err)
  }) 
})

router.post('/login' , (req,res,next) =>{
  passport.authenticate('local', (err, theUser, failureDetails) =>{
    if(err) {
      res.status(400).json({message : "Something went wrong with authenticating user"})
      return ;
    }
    if( !theUser)   {
      res.status(400).json(failureDetails)
    }

    req.login(theUser, (err) =>{
      if(err) {
        res.status(500).json({message : 'Session save went bad'});
        return;
      }
      res.json(theUser)
    });
  })(req,res,next)
});


router.post('/logout' , (req,res,next) =>{
  req.logout();
  res.json({message : 'logout was successful'})
})

router.get('/loggedin' , (req,res,next) =>{
  if(req.isAuthenticated()){
    res.json(req.user)
    return;
  } 
  res.status(500).json({message : 'Unauthorized'})
})


router.get('/user/:id' ,  (req,res,next) =>{
  User.findById(req.params.id)
  .then(user => res.json({user}))
  .catch(err => res.json(err))
})

router.post('/edit-user/:id' , (req,res,next) =>{
  User.findOne({username : req.body.username })
  .then(user => {
    if(user !== null) {
      res.json({message : 'this username is already taken'})
      return;
    }
    const salt     = bcrypt.genSaltSync(10);
    const theHash  = bcrypt.hashSync(req.body.password, salt);

    User.findByIdAndUpdate(req.params.id, {
      username : req.body.username,
      password : theHash
    })
    .then(user =>{
      res.json({message : 'user was updated' , user})
    })
    .catch(err => res.json(err))



  })
  .catch(err => res.json(err))

})

module.exports = router;