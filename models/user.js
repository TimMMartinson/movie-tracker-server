const mongoose = require('mongoose')
const Month = require('./month')
const bcrypt = require('bcrypt')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] // 'magic' arrays or numbers etc ( variable that holds a static value that drives app logic) should be all caps as best practice! MONTHS - so other devs know to not mess with it/ less likely to be mutated accidentally 

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
        months: [{type: mongoose.Schema.Types.ObjectId, ref: 'Month'}], // do we ever need to query months separate of the user ? this is technically setting up a many to many relationship which does not align with your ERD, even tho it functions as 1 to many: consider making a subdoc?
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

// Adding months when user is created
userSchema.pre('save', function (next) { // very nice ! 
    if (!this.isNew) return next() // only run on new documents // love these comments
    for (let i = 0; i < 12; i++) {
        let newMonth = new Month({month: months[i]})
        newMonth.save()
        this.months.push(newMonth)
    }
    next()
})

userSchema.methods.validatePassword = function(password) { 
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)