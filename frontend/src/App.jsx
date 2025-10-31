import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './components/Footer/Footer'
import Team from './Pages/Team'
import Contact from './Pages/Contact'
import Shop from './Pages/Shop'

const AppContent = ({ isLoggedIn, setIsLoggedIn}) => {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleAuthClick = () => {
    navigate('/login');
  };

  const handleAuthFormSwitch = (formType) => {
    if (formType === 'signup') {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Navbar onAuthClick={handleAuthClick} onNavClick={handleNavClick} isLoggedIn={isLoggedIn}/>
      <div className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login onFormSwitch={handleAuthFormSwitch} setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/signup" element={<Signup onFormSwitch={handleAuthFormSwitch} setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />}/>
          </Routes>
      </div> 
      <Footer />
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      </BrowserRouter>
    </>
  )
}

export default App;
