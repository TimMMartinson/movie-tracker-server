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
            required: true,
        },
        comments: {
            type: String,
        },
        month: {
            type: Schema.Types.ObjectId,
            ref: 'Month',
            required: true
        }
    },
    {
        timestamps: true,
    }
)

// Creating Mongoose model
// Collection will be called movies
const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie