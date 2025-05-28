const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.json())


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
    morgan((tokens, req, res) => {
        const log = [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'), '-',
          tokens['response-time'](req, res), 'ms'
        ]

        if (req.method === 'POST') {
            log.push(tokens.body(req, res))
        }

        return log.join(' ')
    })
)

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/info', (request, response) => {
    const entryCount = persons.length
    const time = new Date()

    response.send(
        `<p>Phonebook has info for ${entryCount} people</p><p>${time}</p>`
    )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }
 if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
 }

 const person = {
    id: Math.floor(Math.random() * 1000000).toString(), // Random ID
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server phonebook running on port ${PORT}`)
})
