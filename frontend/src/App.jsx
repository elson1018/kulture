import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Footer from './components/Footer/Footer'
import Team from './Pages/Team'
import Contact from './Pages/Contact'
import Shop from './Pages/Shop'
import Souvenirs from './Pages/Souvenirs';
import ProductDetail from './Pages/ProductDetail';
import Food from './Pages/Food';
import Instruments from './Pages/Instruments';
import Tutorial from './Pages/Tutorial';
import AddProduct from './Pages/AddProduct';
import HelpCentre from './Pages/HelpCentre';
import SupplierDashboard from './Pages/SupplierDashboard';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // If user is not logged in, the user will redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but role is not allowed (customer) only admin and supplier can
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Send them Home
  }

  // If all checks pass then render the page
  return children;
};

const AppContent = ({user, setUser}) => {
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleNavClick = (path) => {
    if (path === 'home') {
      navigate('/');
    } else {
      navigate(path);
    }
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

            <Route path="/login" element={<Login onFormSwitch={handleAuthFormSwitch} setUser={setUser}/>} />
            <Route path="/signup" element={<Signup onFormSwitch={handleAuthFormSwitch}/>}/>

            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help-centre" element={<HelpCentre />} />

            <Route path="/shop" element={<Shop />}/>
            <Route path="/shop/food" element={<Food />} />
            <Route path="/shop/souvenirs" element={<Souvenirs />} />
            <Route path="/shop/instruments" element={<Instruments />} />
            <Route path="/shop/tutorial" element={<Tutorial />} />
            <Route path="/product/:id" element={<ProductDetail />}/>

            <Route path='/supplier' element={<ProtectedRoute user={user} allowedRoles={['supplier', 'admin']}><SupplierDashboard  user={user}></SupplierDashboard></ProtectedRoute>}/>
            <Route path="/add-product" element={<ProtectedRoute user={user} allowedRoles={['supplier', 'admin']}><AddProduct /></ProtectedRoute>}/>
            
          </Routes>
      </div> 
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <BrowserRouter>
        <AppContent user={user} setUser={setUser}/>
      </BrowserRouter>
    </>
  )
}

export default App;
