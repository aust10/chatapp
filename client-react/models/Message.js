const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
// const User = require('./User.js')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const messageSchema = Schema({
  text: {
    type: String,
    required: true,
    unique: false
  },
  date: {
    type: Date,
    required: true
  },
  room: {
    type: String,
    require: true
  },
  user: {
    type: ObjectId,
    required: true,
    ref: 'User'
  }
})

messageSchema.statics.postMessage = async function (text, date, user) {
  const message = new this()
  message.text = text
  message.date = date
  message.user = user

  await message.save()

  return message
}

// initialize the message model by saying "Message" and the thing within the quotes is what you call thoughout the app to use this model "reference"
const Message = mongoose.model('Message', messageSchema)

module.exports = Message
