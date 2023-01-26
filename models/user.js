const mongoose = require('mongoose')
const Month = require('./month')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
userSchema.pre('save', function (next) {
    if (!this.isNew) return next() // only run on new documents
    for (let i = 0; i < 12; i++) {
        let newMonth = new Month({month: months[i]})
        newMonth.save()
        this.months.push(newMonth._id)
    }
    next()
})

module.exports = mongoose.model('User', userSchema)