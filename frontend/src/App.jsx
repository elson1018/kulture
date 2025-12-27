import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Auth pages
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";

// Static pages
import Home from "./Pages/static/Home";
import Team from "./Pages/static/Team";
import Contact from "./Pages/static/Contact";
import HelpCentre from "./Pages/static/HelpCentre";
import About from "./Pages/static/About";
import Policy from "./Pages/static/Policy";

// Shop pages
import Shop from "./Pages/shop/Shop";
import Food from "./Pages/shop/Food";
import Souvenirs from "./Pages/shop/Souvenirs";
import Instruments from "./Pages/shop/Instruments";
import ProductDetail from "./Pages/shop/ProductDetail";

// Tutorial pages
import Tutorial from "./Pages/tutorials/Tutorial";
import TutorialDetail from "./Pages/tutorials/TutorialDetail";

// Cart pages
import Cart from "./Pages/cart/Cart";
import Checkout from "./Pages/cart/Checkout";

// Admin pages
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AddProduct from "./Pages/admin/AddProduct";
import Orders from "./Pages/admin/Orders";

// User pages
import Settings from "./Pages/user/Settings";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // If user is not logged in, the user will redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but role is not allowed (customer) only admin can
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Send them Home
  }

  // If all checks pass then render the page
  return children;
};

const AppContent = ({ user, setUser }) => {
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleNavClick = (path) => {
    if (path === "home") {
      navigate("/");
    } else {
      navigate(path);
    }
  };

  const handleAuthClick = () => {
    navigate("/login");
  };

  const handleAuthFormSwitch = (formType) => {
    if (formType === "signup") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };

  // this is the function used to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);

    navigate("/");
  };

  return (
    <div className="app-container">
      <Navbar
        onAuthClick={handleAuthClick}
        onNavClick={handleNavClick}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <Login onFormSwitch={handleAuthFormSwitch} setUser={setUser} />
            }
          />
          <Route
            path="/signup"
            element={<Signup onFormSwitch={handleAuthFormSwitch} />}
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute user={user}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help-centre" element={<HelpCentre />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/food" element={<Food />} />
          <Route path="/shop/souvenirs" element={<Souvenirs />} />
          <Route path="/shop/instruments" element={<Instruments />} />
          <Route path="/shop/tutorial" element={<Tutorial user={user} />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
                <AdminDashboard user={user}></AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute user={user} allowedRoles={["ADMIN"]}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute user={user}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user}>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if this is a new browser session 
    const isNewSession = !sessionStorage.getItem("app_session_active");

    if (isNewSession) {

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser(null);

      sessionStorage.setItem("app_session_active", "true");
    } else {
      //Restore user state
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent user={user} setUser={setUser} />
      </BrowserRouter>
    </>
  );
}

export default App;
