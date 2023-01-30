const mongoose = require('mongoose')

const Schema = mongoose.Schema

const monthSchema = new Schema(
    {
        month: {
            type: String,
            required: true,
        },
        movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
    },
    {
        timestamps: true,
    }
)

const Month = mongoose.model('Month', monthSchema)

module.exports = Month