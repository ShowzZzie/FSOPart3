const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('build'))
var morgan = require('morgan')

app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
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


  app.get('/api/persons', (req, res) => {
    res.json(notes)
  })

  app.get('/info', (req, res) => {
    const message = `Phonebook has info for ${notes.length} people`
    const date = new Date()
    res.send(`${message}<br><br>${date}`)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (!note) {
        res.status(404).send('Sorry, the requested note was not found.')
    }
    else {
        res.json(note)
    }

  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
  })
  
  app.post('/api/persons', (req, res) => {
    const data = req.body

    if (!data) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    if (!data.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if (!data.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }
    if (notes.find(note => note.name.toLowerCase() === data.name.toLowerCase())) {
        return res.status(400).json({
            error: 'name already in database'
        })
    }

    const note = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: data.name,
        number: data.number
    }

    notes = notes.concat(note)

    res.json(notes)

  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })