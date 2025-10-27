import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './components/Footer/Footer'
import Team from './Pages/Team'
import Contact from './Pages/Contact'

function App() {

  const [activePage, setActivePage] = useState('home');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePageSwitch = (pageName) => {
    setActivePage(pageName);
  }

  const renderContent = () => {
    if (activePage === 'login') {
      return <Login onFormSwitch={handlePageSwitch} />;
    }
    if (activePage === 'signup') {
      return <Signup onFormSwitch={handlePageSwitch} />;
    }
    if (activePage === 'team') {
      return <Team/>;
    }
    if (activePage === 'contact') {
      return <Contact />
    }
    return <Home />;
  };

  return (
    <>
      <Navbar onAuthClick={() => {handlePageSwitch('login')}} onNavClick={handlePageSwitch} isLoggedIn={isLoggedIn}/>
      <div className='main-content'>{renderContent()}</div>
      <Footer />
    </>
  )
}

export default App
