import React from 'react'
import {
  useHistory
} from 'react-router-dom'

// This is a functional component that handles the rooms
export default function Rooms (props) {
  const history = useHistory()

  // Hanlder function that handles when the user changes rooms and pushes to that selected room
  function handleChangeRoom (evt) {
    const room = evt.target.value
    history.push(`/rooms/${room}`)
    console.log(history, 'this is history')
  }

  // Handler function that sends a prompt to the user allowing them to enter a room and then pushes to that room they created
  function handleAddRoom () {
    const room = prompt('Enter a room name')
    history.push(`/rooms/${room}`)
  }

  // return jsx, this is the room selector
  return <div id='rooms'>
    {props.loggedIn ? <h1>Hi {props.username}!</h1> : <h1>Please log in.</h1>}

    <button onClick={handleAddRoom}>Add Room</button><br />
    <label htmlFor='room-select'>Change Room: </label>
    <select onChange={handleChangeRoom} name='room' id='room-select' value={props.room}>
      <option value=''>--Select a Room--</option>
      {props.rooms.map(room => <option key={room} value={room}>{room}</option>)}
    </select>
  </div>
}
