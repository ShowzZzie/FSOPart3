const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("build"))
var morgan = require("morgan")
require("dotenv").config()
const Person = require("./models/phonebook")

const errorHandler = (error, request, response, next) => {

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, "content-length"), "-",
		tokens["response-time"](req, res), "ms",
		JSON.stringify(req.body)
	].join(" ")
}))

let notes = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]


app.get("/api/persons", (req, res) => {
	Person.find({}).then(result => {
		res.json(result)
	})
})

app.get("/info", (req, res) => {
	Person.countDocuments({}, (err, count) => {
		if (err) {
			res.status(500).send("Error getting count of persons")
		} else {
			const message = `Phonebook has info for ${count} people`
			const date = new Date()
			res.send(`${message}<br><br>${date}`)
		}
	})
})

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id).then(result => {
		res.json(result)
	}).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id
	Person.findByIdAndRemove(id)
		.then(result => {
			if (result) {
				res.status(204).end()
			} else {
				res.status(404).end()
			}
		})
})

app.post("/api/persons", (req, res, next) => {
	const data = req.body

	if (!data) {
		return res.status(400).json({
			error: "content missing"
		})
	}
	if (!data.name) {
		return res.status(400).json({
			error: "name is missing"
		})
	}
	if (!data.number) {
		return res.status(400).json({
			error: "number is missing"
		})
	}
	if (notes.find(note => note.name.toLowerCase() === data.name.toLowerCase())) {
		return res.status(400).json({
			error: "name already in database"
		})
	}

	const person = new Person({
		name: data.name,
		number: data.number
	})

	person.save()
		.then(result => {
			res.json(result)
		})
		.catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
	const id = req.params.id
	const newPerson = {
		name: req.body.name,
		number: req.body.number,
		id: id
	}

	Person.findByIdAndUpdate(id, newPerson, { new: true })
		.then(updated => res.json(updated))
		.catch(error => next(error))
})

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})