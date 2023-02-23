const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
	const password = process.argv[2]

	const url =
    `mongodb+srv://showzzzie:${password}@part3phonebook.v3zcfx5.mongodb.net/Phonebook?retryWrites=true&w=majority`

	mongoose.set("strictQuery",false)
	mongoose.connect(url)

	Person.find({}).then(result => {
		console.log("Phonebook:")
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
		process.exit(1)
	})
}
else if (process.argv.length === 5) {
	const password = process.argv[2]

	const url =
    `mongodb+srv://showzzzie:${password}@part3phonebook.v3zcfx5.mongodb.net/Phonebook?retryWrites=true&w=majority`

	mongoose.set("strictQuery",false)
	mongoose.connect(url)

	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})

	person.save().then(() => {
		console.log("contact added")
		mongoose.connection.close()
	})
}
else if (process.argv.length < 3 || process.argv.length > 5) {
	console.log("display contacts usage: node mongo.js {password}")
	console.log("add contact usage: node mongo.js {password} {name} {number}")
	process.exit(1)
}

