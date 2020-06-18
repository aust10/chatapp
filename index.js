const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
// const fs = require('fs')

// import controlers from controler folder
const AuthController = require('./client-react/controllers/auth')
const ProtectedRoutes = require('./client-react/controllers/protected')
const socketController = require('./client-react/controllers/socketcontroller')

const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socketController(io))
// Make sure it RETURNS a function

const port = 8000
// const MESSAGES_PATH = './messages.txt'

// set middleware
app.use(express.static('static'))
app.use(morgan('tiny'))
app.use(express.json())

// login and sigh up routes
app.use('/', AuthController)

// protected routes (requires authentication)
app.use('/', ProtectedRoutes)

const connectDatabase = async (dbName = 'chatProject', hostname = 'localhost') => {
  const database = await mongoose.connect(`mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )

  console.log(`Database connected at mongodb://${hostname}/${dbName}...`)

  return database
}

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server listening on port ${port}...`)
  })
}

startServer(port)
// MOVE TO THE PROTECTED ROUTE

// app.get('/messages', (req, res) => {
//   fs.readFile(deps.messagesPath, 'utf8', (err, text) => {
//     if (err) return res.status(500).send(err)

//     const messages = text
//       .split('\n')
//       .filter(txt => txt) // will filter out empty string
//       .map(JSON.parse)

//     return res.json(messages)
//   })
// })

// app.post('/messages', (req, res) => {
//   // console.log(req)
//   const message = JSON.stringify(req.body)
//   fs.appendFile(deps.messagesPath, '\n' + message, err => {
//     if (err) return res.status(500).send(err)

//     return res.send('post successful')
//   })
// })

// const http = require('http').createServer(app)
// const io = require('socket.io')(http)

// io.on('connection', (socket) => {
//   console.log('a user connected')

//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg)
//     fs.appendFile(deps.messagesPath, '\n' + JSON.stringify(msg), err => err ? console.log(err) : null)
//   })

//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
// })

// app.listen(port)

console.log('server listening on port:', port)
