// CRUD
const express = require('express');
const router  = express.Router();

const Movie   = require('../models/movie')
const User    = require('../models/User')

router.post('/create-movie', (req,res,next) =>{
    Movie.findOne({name : req.body.name})
    .then((movie) =>{
        if(movie!==null) { res.json({message : ' this movie already exists'})  }
        else{
            Movie.create({
                name     : req.body.name,
                budget   : req.body.budget,
                director : req.body.director,
                actors   : req.body.actors.split(',')
            })
            .then(movie  => {
             res.json(movie)
             console.log(req.user)   
            })    
            .catch(err   => res.json(err) )
        }
    })
    .catch(err => res.json(err))
})

router.post('/edit-movie/:id', (res,req,next) =>{
    Movie.findByIdAndUpdate(req.params.id, {
        name     : req.body.name,
        budget   : req.body.budget,
        director : req.body.director,
        actors   : req.body.actors.split(',')

    })
    .then(movie => res.json(movie))
    .catch(err  => res.json(err))
})


router.post('/fav-movie/:id' , (req,res,next) =>{
    if(!req.user) {
    res.json({message : 'you have to be logged in'});
    return;
    }
    Movie.findById(req.params.id)
    .then(movie =>{
        console.log(movie, req.user)
        User.findOneAndUpdate({ _id :  req.user.id }, 
            { $push : { favMovies : movie._id }}
        )
        .then(user => res.json(user))
        .catch(err => res.json(err))


    })
    .catch(err => res.json(err))

    

})
module.exports = router;