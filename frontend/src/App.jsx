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
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Footer from "./components/Footer/Footer";
import Team from "./Pages/Team";
import Contact from "./Pages/Contact";
import Shop from "./Pages/Shop";
import Souvenirs from "./Pages/Souvenirs";
import ProductDetail from "./Pages/ProductDetail";
import Food from "./Pages/Food";
import Instruments from "./Pages/Instruments";
import Tutorial from "./Pages/Tutorial";
import TutorialDetail from "./Pages/TutorialDetail";
import AddProduct from "./Pages/AddProduct";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import HelpCentre from "./Pages/HelpCentre";
import SupplierDashboard from "./Pages/AdminDashboard";
import Settings from "./Pages/Settings";
import ScrollToTop from "./components/ScrollToTop";

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
                <SupplierDashboard user={user}></SupplierDashboard>
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
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        // Restore the user object into state
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user"); // Clean up if data is corrupted
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
