const jwt = require('jsonwebtoken')
const Message = require('../models/Message')
const User = require('../models/User')

// Function that handles the sockets
function socketController (io) {
  return (socket) => {
    console.log('a user connected')

    // when a socket connects to 'chat message' use the message they sent and verify it with jwt.verify
    socket.on('chat message', (msg) => {
      try {
        if (!jwt.verify(msg.token, 'CHANGEME!')) {
          return console.log('Not authorized')
        }

        const payload = jwt.decode(msg.token, 'CHANGEME!')
        // From the User model use the mongoose findOne syntax and get the user id
        User.findOne({ _id: payload._id }, async (err, userDoc) => {
          if (err) return console.error(err)

          // The message variable makes a new message and gives it the following variabele: the user is the userDoc which is the _id and this can be decoded using the .populate method
          const message = new Message()
          message.text = msg.text
          message.date = msg.date
          message.user = userDoc
          message.room = msg.room

          // save the message
          await message.save()

          console.log('about to emit chat')

          // use the emit to send everything inside message and change the token to undefined so the user can not see the token
          io.emit('chat message', {
            ...msg,
            user: { username: userDoc.username },
            token: undefined
          })
        })
      } catch (err) {
        return console.error(err)
      }
    })
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  }
}

module.exports = socketController

//   io.on('connection', (socket) => {
//     console.log('a user connected')

//     socket.on('chat message', (msg) => {
//       io.emit('chat message', msg)
//       fs.appendFile(deps.messagesPath, '\n' + JSON.stringify(msg), err => err ? console.log(err) : null)
//     })

//     socket.on('disconnect', () => {
//       console.log('user disconnected')
//     })
//   })

// UNUSED SOCKET
// socket.on('login', (msg) => {
//   try {
//     console.log(msg, 'this is the message')
//     if (!jwt.verify(msg, 'CHANGEME!')) {
//       return console.log('Not authorized')
//     }

//     // const payload = jwt.decode(msg.token, 'CHANGEME!')

//     Message.find({}, (err, message) => {
//       if (err) return console.error(err)
//       io.emit('login', {
//         ...msg,
//         message: { message: message },
//         token: undefined
//       })
//     })
//   } catch (err) {
//     return console.error(err)
//   }
// })