const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// unused imports
const User = require('../models/user')
const Month = require('../models/month')
const Movie = require('../models/movie')
const auth = require('../config/auth')
const { createUserToken } = require('../config/auth')
// unused imports 
const router = express.Router()

// POST /sign-up
router.post('/sign-up', (req, res, next) => {
    bcrypt
        .hash(req.body.credentials.password, 10) // be consistent, put the .hash on the same line as bcrypt like you did with User below 
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
            const error = new Error('The provided email or password is incorrect') // these 2 blocks have the same return, we could refactor this into 1 block using a || 'or' conditional 
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
router.get('/user', auth.requireToken, (req, res) => { // interesting - this seems much more like a month route to me, also, couldn't you just change the sign in above to return the user as json along with the token ? ( and populate the months ? )
    User.findById(req.user.id)
        .populate('months')
        .then(user => {
            let month = user.months.find(month => month._id === req.query.month)
            res.send({month: month, monthId: month._id})
        })
        .catch(err => res.send(err))
})



module.exports = router