const express = require('express')
const { handle404 } = require('../lib/custom-errors')
const auth = require('../config/auth')

const Month = require('../models/month')
const Movie = require('../models/movie')
const User = require('../models/user')
const router = express.Router()
// unused imports 
// INDEX (GET)
router.get('/months', auth.requireToken, (req, res, next) => { // see user routes, since we're only getting them, why not just put them all into the FE when you sign in and cache them in the store ? 
    User.findById(req.user.id)
        .populate('months')
        .then((user) => {
            res.json({ months: user.months })
        })
        .catch((err) => {
            next(err)
        })
})

// SHOW (GET)
router.get('/months/:monthId', auth.requireToken, (req, res, next) => {
    Month.find({ _id: req.params.id, user: req.user.id }) // above 
        .populate('movies')
        .then((month) => {
            res.json({ month })
        })
        .catch((err) => {
            next(err)
        })
        console.log(month)
})
module.exports = router