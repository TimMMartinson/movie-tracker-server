const express = require('express')

const mongoose = require('mongoose')

const cors = require('cors')

const db = require('./config/db')

const monthRoutes = require('./routes/month-routes')
const movieRoutes = require('./routes/movie-routes')
const userRoutes = require('./routes/user-routes')
const requestLogger = require('./lib/request-logger')

const PORT = 8000

mongoose.set('strictQuery', true)

mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const app = express()

app.use(cors({ origin: `http://127.0.0.1:5500` }))

app.use(express.json())
app.use(requestLogger)

app.use(monthRoutes)
app.use(movieRoutes)
app.use(userRoutes)

app.listen(PORT, () => {
	console.log('listening on port ' + PORT)
})

module.exports = app