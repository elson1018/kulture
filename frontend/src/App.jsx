import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Login />
      <Signup />
      <Footer />
    </>
  )
}

export default App
