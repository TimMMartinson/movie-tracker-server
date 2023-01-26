const express = require('express')
const { handle404 } = require('../lib/custom-errors')

const Movie = require('../models/movie')
const auth = require('../config/auth')

const router = express.Router()

// INDEX (GET)
router.get('/months/:id/movies', auth.requireToken, (req, res, next) => {
    Movie.find({ month: req.params.id, user: req.user.id })
        .then((movies) => {
            res.json({ movies })
        })
        .catch((err) => {
            next(err)
        })
})

// SHOW ONE (GET)
router.get('/months/:id/movies/:movieId', auth.requireToken, (req, res, next) => {
    Movie.findOne({ _id: req.params.movieId, month: req.params.id, user: req.user.id })
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

// CREATE (POST)
router.post('/months/:id/movies', auth.requireToken, (req, res, next) => {
    const newMovie = new Movie({ ...req.body, month: req.params.id })
    newMovie.save()
        .then((movie) => {
            res.status(201).json({ movie })
        })
        .catch((err) => {
            next(err)
        })
})

// UPDATE (PATCH)
router.patch('/months/:id/movies/:movieId', (req, res, next) => {
    Movie.findOneAndUpdate({ _id: req.params.movieId, month: req.params.id, user: req.user.id }, req.body, { new: true })
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
router.delete('/months/:id/movies/:movieId', (req, res, next) => {
    Movie.findOneAndRemove({ _id: req.params.movieId, month: req.params.id, user: req.user.id })
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router