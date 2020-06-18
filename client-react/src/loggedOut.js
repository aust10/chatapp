import React from 'react'
import { useHistory } from 'react-router-dom'

// this is a function component that handles the loggout funcgtion and calls useHistory to push to the '/' route and returns jsx that is the login menu
export default function Home (props) {
  function LoggedOut () {
    const history = useHistory()
    history.push('/')
  }
  LoggedOut()
  return <div id='chatroom'>
    <h1>Welcome</h1>
    <form onSubmit={props.onHandle}>
      <label>Username</label>
      <input type='text' id='nickname' />
      <label>Password</label>
      <input type='password' />
      <input type='submit' value='submit' key='submit' />
    </form>
  </div>
}
