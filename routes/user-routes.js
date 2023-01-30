const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Month = require('../models/month')
const Movie = require('../models/movie')
const auth = require('../config/auth')
const { createUserToken } = require('../config/auth')

const router = express.Router()

// POST /sign-up
router.post('/sign-up', (req, res, next) => {
    bcrypt
        .hash(req.body.credentials.password, 10)
        .then(hashedPassword => {
            return {
                email: req.body.credentials.email,
                password: hashedPassword
            }
        })
        .then(user => User.create(user))
        .then(user => {
            res.status(201).json({ user: user })
        })
        .catch(next)
})

// POST /sign-in
router.post('/sign-in', (req, res, next) => {
    User.findOne({ email: req.body.credentials.email })
    .then((user) => {
        if (!user) {
            const error = new Error('The provided email or password is incorrect')
            error.statusCode = 401
            throw error
        }

        if (!user.validatePassword(req.body.credentials.password)) {
            const error = new Error('The provided email or password is incorrect')
            error.statusCode = 401
            throw error
        }

        const token = createUserToken(req, user)
        res.status(200).json({ token })
    })
    .catch((err) => {
        next(err)
    })
})

// Get Current User (GET)
router.get('/user', auth.requireToken, (req, res) => {
    User.findById(req.user.id)
        .populate('months')
        .then(user => {
            let month = user.months.find(month => month._id === req.query.month)
            res.send({month: month, monthId: month._id})
        })
        .catch(err => res.send(err))
})

// Get All Months for User (GET)
router.get('/user/:id/months', auth.requireToken, (req, res, next) => {
    User.findById(req.user.id)
        .populate('months')
        .then((user) => {
            res.json({ months: user.months })
        })
        .catch((err) => {
            next(err)
        })
})

// Get All Movies for Month (GET)
router.get('/months/:id/movies', auth.requireToken, (req, res, next) => {
    Movie.find({ month: req.params.id, user: req.user.id })
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

module.exports = router