import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  return (
    <div>
      <UserTable />
    </div>
  );
}

function UserTable() {
  // REMINDER: Since state is declared here, the set fn needs to be 
  //           passed down as a callback if children want to change it.
  let [userData, setUserData] = useState([]);

  // GET request all users
  useEffect(() => {
    fetch("/users").then(
      response => response.json()
    ).then(
      data => {
        setUserData(data)
      }
    )
  }, []);

  // create array of TableRows 
  const rows = [];
  userData.forEach((user, index, array) => {
    rows.push(
      <TableRow
        index={index}
        userData={userData}
        setUserData={setUserData}
        key={index} />
    )
  })

  return (
    <div>
      <h1>User Table</h1>
      <table>
        <TableHeader />
        <tbody>
          {rows}
          <tr>
            <td colSpan="3">
              <button onClick={() => onNewUserButtonClick(userData, setUserData)}>Add New User</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TableHeader() {
  return(
    <thead>
      <tr>
        <th colSpan="3">Users</th>
      </tr>
      <tr>
        <th >Name</th>
        <th>Email</th>
        <th>Edit Btns</th>
      </tr>
    </thead>
  );
}

function TableRow( {index, userData, setUserData} ) {
  return (
    <tr>
      <td>{userData[index].name}</td>
      <td>{userData[index].email}</td>
      <td>
        <button onClick={() => onEditButtonClick(index, userData, setUserData)}>
          Edit
        </button>
        <button onClick={() => onDeleteButtonClick(index, userData, setUserData)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default App;


function onNewUserButtonClick(userData, setUserData) {
  let name = prompt("Name:");
  let email = prompt("Email:");
  
  let newUser = {// MUST WAIT TO GET THE ID FROM THE BACKEND BEFORE UPDATING STATE
    "name": name,
    "email": email
  }

  fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  }).then(
    data => data.text()
  ).then(
    response => {
      // reset user data, with the id from the backend
      let id = JSON.parse(response).id
      newUser["id"] = id;
      let newUserData = userData.toSpliced(userData.length, 0, newUser)
      setUserData(newUserData);
    }
  )
}

function onDeleteButtonClick(index, userData, setUserData) {
  // Delete from database first, then from state
  // console.log(userData[index].id)
  let URL = `users/${userData[index].id}`
  fetch(URL, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: null
  })
  let newUserData = userData.toSpliced(index, 1);
  setUserData(newUserData);

}

function onEditButtonClick(index, userData, setUserData) {
  let newName = prompt("Name:");
  let newEmail = prompt("Email:");
  let updatedUser = {// MUST WAIT TO GET THE ID FROM THE BACKEND BEFORE UPDATING STATE
    "name": newName,
    "email": newEmail
  }

  let URL = `users/${userData[index].id}`
  fetch(URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
  }).then(
    data => data.text()
  ).then(
    response => {
      // reset user data, with the id from the backend
      let id = JSON.parse(response).id
      updatedUser["id"] = id;
      let newUserData = userData.toSpliced(index, 1, updatedUser);
      setUserData(newUserData);
    }
  )
}