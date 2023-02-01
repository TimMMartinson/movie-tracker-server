const express = require('express')
const { handle404 } = require('../lib/custom-errors')

const Movie = require('../models/movie')
const Month = require('../models/month')
const auth = require('../config/auth')

const router = express.Router()

// INDEX (GET)
router.get('/movies', auth.requireToken, (req, res, next) => {
    Month.find({ month: req.params.monthId, user: req.user.id })
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

// // SHOW ONE (GET)
// router.get('/movies/:movieId', auth.requireToken, (req, res, next) => {
//     Movie.findOne({ _id: req.params.movieId, month: req.params.monthId, user: req.user.id })
//         .then((movie) => {
//             if (!movie) {
//                 handle404()
//             }
//             res.json({ movie })
//         })
//         .catch((err) => {
//             next(err)
//         })
// })

// CREATE (POST)
router.post('/movies', auth.requireToken, (req, res, next) => {
    const newMovie = new Movie({ ...req.body, month: req.body.monthId })
    newMovie.save()
    .then((movie) => {
        Month.findById(req.body.monthId)
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
    Movie.findOneAndUpdate({ _id: req.params.movieId, month: req.params.monthId }, req.body, { new: true })
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
    Movie.findOneAndRemove({ _id: req.params.movieId, month: req.params.monthId })
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router