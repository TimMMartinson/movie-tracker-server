const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Month = require('../models/month')
const Movie = require('../models/movie')
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
        res.json({ token })
    })
    .catch((err) => {
        next(err)
    })
})

// Get All Months for User (GET)
router.get('/months', authenticate, (req, res, next) => {
    Month.find({ user: req.user.id })
        .then((months) => {
            res.json({ months })
        })
        .catch((err) => {
            next(err)
        })
})

// Get All Movies for Month (GET)
router.get('/months/:id/movies', authenticate, (req, res, next) => {
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

// Middleware function to authenticate user
function authenticate(req, res, next) {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = decoded
        next()
    })
}

module.exports = router