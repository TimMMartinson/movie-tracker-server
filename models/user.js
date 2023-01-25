const mongoose = require('mongoose')
const monthSchema = require('./month')

const userSchema = new mongoose.Schema(
	{
		// field - email unique:true
		email: {
			type: String,
			required: true,
			unique: true,
		},
		// hashed password results
		password: {
			type: String,
			required: true,
		},
        // Each user has 12 months
        months: [{type: mongoose.Schema.Types.ObjectId, ref: 'Month'}],
		token: String,
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_doc, user) => {
				delete user.password
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)