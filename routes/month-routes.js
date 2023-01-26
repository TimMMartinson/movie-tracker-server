const express = require('express')
const { handle404 } = require('../lib/custom-errors')

const Month = require('../models/month')
const Movie = require('../models/movie')

const router = express.Router()

// CREATE (POST)
router.post('/:month/movies', (req, res, next) => {
    Month.findOne({ month: req.params.month })
        .then((month) => {
            if (!month) {
                handle404()
            }
            const newMovie = new Movie(req.body)
            month.movies.push(newMovie)
            return month.save()
        })
        .then((updatedMonth) => {
            res.status(201).json({ updatedMonth })
        })
        .catch((err) => {
            next(err)
        })
})

// SHOW (GET)
router.get('/months/:id', (req, res, next) => {
    Month.findById(req.params.id)
    .populate('movies')
    .then((month) => {
        if (!month) {
            handle404()
        }
        res.json({ month })
    })
    .catch((err) => {
        next(err)
    })
})
module.exports = router