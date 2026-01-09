import { useState, useEffect, lazy, Suspense } from "react";
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
import Loading from "./components/Loading/Loading"; // Using the Loading component we created earlier

// Auth pages
const Login = lazy(() => import("./Pages/auth/Login"));
const Signup = lazy(() => import("./Pages/auth/Signup"));

// Static pages
const Home = lazy(() => import("./Pages/static/Home"));
const Team = lazy(() => import("./Pages/static/Team"));
const Contact = lazy(() => import("./Pages/static/Contact"));
const HelpCentre = lazy(() => import("./Pages/static/HelpCentre"));
const About = lazy(() => import("./Pages/static/About"));
const Policy = lazy(() => import("./Pages/static/Policy"));
const Terms = lazy(() => import("./Pages/static/Terms"));

// Shop pages
const Shop = lazy(() => import("./Pages/shop/Shop"));
const Food = lazy(() => import("./Pages/shop/Food"));
const Souvenirs = lazy(() => import("./Pages/shop/Souvenirs"));
const Instruments = lazy(() => import("./Pages/shop/Instruments"));
const ProductDetail = lazy(() => import("./Pages/shop/ProductDetail"));

// Tutorial pages
const Tutorial = lazy(() => import("./Pages/tutorials/Tutorial"));
const TutorialDetail = lazy(() => import("./Pages/tutorials/TutorialDetail"));

// Cart pages
const Cart = lazy(() => import("./Pages/cart/Cart"));
const Checkout = lazy(() => import("./Pages/cart/Checkout"));

// Admin pages
const AdminDashboard = lazy(() => import("./Pages/admin/AdminDashboard"));
const AddProduct = lazy(() => import("./Pages/admin/AddProduct"));
const Orders = lazy(() => import("./Pages/admin/Orders"));

// User pages
const Settings = lazy(() => import("./Pages/user/Settings"));

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
        <Suspense fallback={<Loading />}>
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
            <Route path="/terms" element={<Terms />} />

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
        </Suspense>
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
