const express = require('express')
const { handle404 } = require('../lib/custom-errors')

const Movie = require('../models/movie')

const router = express.Router()

// INDEX (GET)
router.get('/months/movies', (req, res, next) => {
    Movie.find({})
        .then((movies) => {
            res.json({ movies })
        })
        .catch((err) => {
            next(err)
        })
})

// SHOW ONE (GET)
router.get('/months/movies/:id', (req, res, next) => {
    Movie.findById(req.params.id)
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
router.post('/months/movies', (req, res, next) => {
    const newMovie = new Movie(req.body)
    newMovie.save()
        .then((movie) => {
            res.status(201).json({ movie })
        })
        .catch((err) => {
            next(err)
        })
})

// UPDATE (PATCH)
router.patch('/months/movies/:id', (req, res, next) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
router.delete('/months/movies/:id', (req, res, next) => {
    Movie.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router