const database = {
	development: `mongodb+srv://TM:T@movie-tracker.eqdguvm.mongodb.net/dev?retryWrites=true&w=majority`,
	test: `mongodb+srv://TM:T@movie-tracker.eqdguvm.mongodb.net/test?retryWrites=true&w=majority`,
}

const localDb = process.env.TESTENV ? database.test : database.development

const currentDb = process.env.DB_URI || localDb

module.exports = currentDb
