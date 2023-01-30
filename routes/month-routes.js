const express = require('express')
const { handle404 } = require('../lib/custom-errors')
const auth = require('../config/auth')

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
router.get('/months/:monthIndex', auth.requireToken, (req, res, next) => {
    Month.find({ _id: req.params.id, user: req.user.id })
        .populate('movies')
        .then((month) => {
            res.json({ month })
        })
        .catch((err) => {
            next(err)
        })
})
module.exports = router