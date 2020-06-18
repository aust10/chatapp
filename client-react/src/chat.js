import React from 'react'
import socket from 'socket.io-client'
// import {
//   useParams
// } from 'react-router-dom'
import { withRouter } from 'react-router'

// This function creates the format for each message
function Message (props) {
  return <li className='message-item'>
    <span className='date'>{(new Date(props.message.date)).toLocaleString()}</span>
    <span className='nick'> {props.message.user.username}: </span>
    <span className='text'>{props.message.text} </span>
    {props.message.user.username === props.username ? <span className='del'><button onClick={() => props.del(props.message)}>Delete</button></span> : null}
         </li>
}

// Create a class that can hold state for the messages that the user submits
class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      form: '',
      messages: this.props.messages,
      formValue: '',
      room: ''
    }
  }

  // When the selector is switchecd this set state will set the state for the messages to be produced and submited
  componentDidMount () {
    const room = this.props.match.params.room
    this.setState({ room: room })
  }

  // Handle when the Submit button is pressed to send a new message
  sendMessage (evt) {
    evt.preventDefault()
    // get the context of each message and send the object based on the stat and forms value
    const message = { text: this.state.formValue, username: this.props.username, room: this.state.room, date: new Date(), token: this.props.token }

    // call the handleSubmit function that is passed from App.js
    this.props.handleSubmit(message)
  }

  // Handle the form inputs change, this happens every time a key is pressed
  handleChangeFormInput (evt) {
    this.setState({ formValue: evt.target.value })
  }

  deleteMessage (evt) {
    console.log(evt)
    const delContent = { text: evt.text, user: evt.user._id }
    console.log(delContent, 'this is del content line 54')
    this.props.handleDelete(delContent)
  }

  // A Class calls a render and a return of jsx, here we filter out the messages acording to the selected room and pass the props to the function component above that makes the layout of message
  render () {
    return (
      <div id='chatroom'>
        <h1>{this.state.room}</h1>
        <div id='chatbox'>
        <ul id='messages'>
          {this.props.messages.filter(msg => msg.room === this.state.room).map((msg, i) => <Message message={msg} key={i} del={this.deleteMessage.bind(this)} username={this.props.username} />)}
        </ul>
        </div><br />
        <form id='send-message' onSubmit={this.sendMessage.bind(this)}>
          <input id='message-text' type='text' placeholder='message...' value={this.formValue} onChange={this.handleChangeFormInput.bind(this)} />
          <button type='submit'>Send</button>
        </form>
      </div>
    )
  }
}

export default withRouter(Chat)
