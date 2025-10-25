import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './components/Footer/Footer'
import Team from './Pages/Team'

function App() {

  const [activeForm, setActiveForm] = useState('login');

  const toggleForm = (formType) => {
        setActiveForm(formType);
    };

    const renderContent = () => {
        if (activeForm === 'login') {
            return <Login onFormSwitch={toggleForm} />;
        }
        if (activeForm === 'signup') {
            return <Signup onFormSwitch={toggleForm} />;
        }
        else {
          return null;
        }
    };

  return (
    <>
      <Navbar />
      <div>{renderContent()}</div>
      <Team />
      <Footer />
    </>
  )
}

export default App
