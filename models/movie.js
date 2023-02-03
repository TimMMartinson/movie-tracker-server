const mongoose = require('mongoose')

const Schema = mongoose.Schema

const movieSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        watched: {
            type: Boolean,
            required: true, // did we consider a default false here ? 
        },
        comments: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

// Creating Mongoose model
// Collection will be called movies
const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie