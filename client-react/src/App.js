/* globals fetch prompt */
import Chat from './chat'
import Rooms from './rooms'
import Home from './home'
import Signup from './signup'
import LoggedOut from './loggedOut'
import React from 'react'
import io from 'socket.io-client'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

// const http = require('http')

// call io here so that you can use it in other components
const socket = io()

// create a class in order to be able to store the state of the messages and users information
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      room: '',
      formValue: '',
      loggedIn: false,
      username: '',
      token: ''
    }
  }

  // componentDidMount returns the initial messages on page load
  componentDidMount () {
    socket.on('chat message', msg => {
      console.log('Got a message:', msg)
      this.setState({ messages: this.state.messages.concat(msg) })
    })
  }

  // Handel when the login button is pressed
  handleLogin (evt) {
    evt.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    console.log(username, 'this is the username')

    // Send a POST request to login "located in auth.js" (this verifys the user is valid)
    // Handle the Get Messages in the promise of the first Fetch request "/messages is found in protected.js"
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => {
        // in order to call this.setstate and the fetch in this promis you need to use the async promise
        // do this by saying setState({}, () => {})
        this.setState({ token: data.token, username: data.username, loggedIn: true }, () => {
          console.log(this.state, 'this is the states username')
          fetch('/messages', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.state.token}`
            }
          })
            .then(response => response.json())
            // Once the "GET" request runs handle the promise by setting the state with the messages that come back
            .then(data => this.setState({ messages: data }, () => { console.log(data, 'this is the data we are getting on login') }))
        }
        )
      })
  }

  // Handle when the Sign up Button is pressed
  handleSignUp (evt) {
    evt.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    // Send a "POST" request to sign up located in "auth.js"
    // With the promise set the state with the token and username that comes back
    fetch('/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ token: data.token, username: data.username, loggedIn: true }, () => {
          fetch('/messages', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.state.token}`
            }
          })
            .then(response => response.json())
            // Once the "GET" request runs handle the promise by setting the state with the messages that come back
            .then(data => this.setState({ messages: data }, () => { console.log(data, 'this is the data we are getting on login') }))
        })
        console.log(this.state)
      })
  }

  // Handle when the Logout button is pressed
  handleLogOut () {
    // Set the state reflecting that everything is null and no user is signed in
    this.setState({
      loggedIn: false,
      username: '',
      messages: [],
      room: '',
      formValue: '',
      token: ''
    })
  }

  // Handle when the Submit button is pressed
  handleSubmit (message) {
    // This sends an emit to "socketcontroller.js" with the messaged data that the user submits
    socket.emit('chat message', message)
  }

  handleDelete (delContent) {

    console.log(delContent, 'this is del content line 140')
    fetch('/messages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body:
        JSON.stringify(delContent)
    })
      .then(response => console.log(response))
    fetch('/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      }
    })
      .then(response => response.json())
      // Once the "GET" request runs handle the promise by setting the state with the messages that come back
      .then(data => this.setState({ messages: data }, () => { console.log(data, 'this is the data we are getting on delete') }))
  }

  // This gets the rooms and filters out duplicates for the select feture in the rooms component
  getRooms () {
    const rooms = this.state.messages.map(msg => msg.room)
    // we have to add the currentRoom to the list, otherwise it won't be an option if there isn't already a message with that room
    rooms.push(this.state.room)
    // filter out undefined or empty string
    const filtered = rooms.filter(room => room)
    // filters out the duplicates
    return Array.from(new Set(filtered))
  }

  // with a Class you need to have a render() that has a return and in this case a router
  render () {
    return (
      <Router>
        <div>
          <nav>
            {this.state.loggedIn ? <div><span className='linkTo'><Link to='/'><button type='button'>Back</button></Link></span><span className='linkTo' onClick={this.handleLogOut.bind(this)}><Link to='/logout'><button type='button'>Logout</button></Link></span></div> : <div><span className='linkTo'><Link to='/'><button type='button'>Home</button></Link></span><span className='linkTo'><Link to='/login'><button type='button'>Login</button></Link></span><span className='linkTo'><Link to='/signup'><button type='button'>Signup</button></Link></span></div>}
          </nav>

          {/* Make sure your passing the proper props to each component */}
          <div id='main-wrap'>
            <Switch>
              <Route path='/rooms/:room'>
                <Chat messages={this.state.messages} room={this.state.room} formValue={this.state.formValue} username={this.state.username} token={this.state.token} handleSubmit={this.handleSubmit.bind(this)} handleDelete={this.handleDelete.bind(this)} />
              </Route>
              <Route path='/login'>
                <h1>Login</h1>
                <Home onHandle={this.handleLogin.bind(this)} />
                {this.state.loggedIn ? <Redirect to='/' /> : null}
              </Route>
              <Route path='/logout'>
                <h1>Logged Out</h1>
                {/* <LoggedOut onHandle = {this.handleLogOut.bind(this)} /> */}
                <LoggedOut />
              </Route>
              <Route path='/signup'>
                <h1>Sign-Up</h1>
                <Signup onHandle={this.handleSignUp.bind(this)} />
                {this.state.loggedIn ? <Redirect to='/login' /> : null}
              </Route>
              <Route path='/'>
                <h1>Welcome to the Project Chat Homepage</h1>
                {this.state.loggedIn ? <Rooms
                  loggedIn={this.state.loggedIn}
                  username={this.state.username}
                  room={this.state.room}
                  rooms={this.getRooms()} /> : <h1>Please log in.</h1>}
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
