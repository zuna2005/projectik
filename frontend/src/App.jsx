import Form from "./components/Form"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from "./components/Home"
import AppContext from "./AppContext"
import { useState } from "react";
import UpdateUser from "./UpdateUser";
  


function App() {
  // const [user, setUser] = useState({status: ''});
  // const changeUserState = async (values) => {
  //   let newUser = await UpdateUser(values)
  //   setUser(newUser)
  //   return newUser
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Form heading='Login' />}></Route>
        <Route path='/signup' element={<Form heading='Sign up' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
