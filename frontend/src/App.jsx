import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Login from './Pages/Login'
import Signup from './Pages/Signup'

function App() {
  return (
    <>
      <Navbar />
      <Login />
      <Signup />
    </>
  )
}

export default App
