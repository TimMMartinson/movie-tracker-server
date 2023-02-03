const express = require('express')
const { handle404 } = require('../lib/custom-errors')

const Movie = require('../models/movie')
const Month = require('../models/month')
const auth = require('../config/auth')

const router = express.Router()

// INDEX (GET)
router.get('/movies', auth.requireToken, (req, res, next) => {
    Month.find({ month: req.params.monthId, user: req.user.id }) // nice query here 
        .then((movies) => {
            if (!movies) {
                handle404()
            }
            res.json({ movies })
        })
        .catch((err) => {
            next(err)
        })
})

// SHOW ONE (GET)
router.get('/movies/:movieId', auth.requireToken, (req, res, next) => {
    Movie.findOne({ _id: req.params.movieId, month: req.params.monthId, user: req.user.id }) // there is no month or user on the movie document ?
        .then((movie) => {
            if (!movie) {
                handle404()
            }
            res.json({ movie })
        })
        .catch((err) => {
            next(err)
        })
})

// CREATE (POST) // should elaborate on more complex routes, this is creating a new movie && updating a month to point at it. 
router.post('/movies', auth.requireToken, (req, res, next) => {
    const newMovie = new Movie({ ...req.body, month: req.body.monthId })// Oooooo hmmmm, really brainscrstcher here without running the code to see what happens. Seems redundant to spread and add one of the existing (from spread) kvps ? Also is the monthId helping here at all ? .... are we adding a new kvp to your documents that aren't part of your schema ? ( or trying to ?) ... IS THIS WHY WE"RE FILTERING BY THE MONTHID TOO ?! .... <.< .... lets not do this, because if its not working -> nothing will change(I don't think it is because Mongoose) || if it IS working -> we are side stepping the reason we use Mongoose to begin with, validating our db document entries! see the other 2 route files for my thoughts about how to handle the potential solution
    newMovie.save()
    .then((movie) => {
        Month.findById(req.body.monthId) // good job making nested promises chains work and staying organized
            .then((month) => {
                month.movies.push(movie._id)
                return month.save()
            })
            .then(() => {
                res.status(201).json({ movie })
            })
            .catch((err) => {
                next(err)
            })
    })
    .catch((err) => {
        next(err)
    })
})

// UPDATE (PATCH)
router.patch('/movies/:movieId', (req, res, next) => {
    Movie.findOneAndUpdate({ _id: req.params.movieId, month: req.params.monthId }, req.body, { new: true }) // month filter param is redundant, the movie id is unique. Even if you have many months pointing at the movie, ( it IS a many to many after all) updating the movie won't have any bearing on the months pointing at it. 
    .then((movie) => {
        if (!movie) {
            handle404()
        }
        res.json({ movie })
    })
    .catch((err) => {
        next(err)
    })
})

// REMOVE (DELETE)
router.delete('/movies/:movieId', (req, res, next) => {
    Movie.findOneAndRemove({ _id: req.params.movieId, month: req.params.monthId })// I don't think this will update the month to remove the now not in use id of the movie 
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router