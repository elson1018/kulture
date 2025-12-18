import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../../assets/xing.png"; // will change a new icon later
import search_icon from "../../assets/search_icon.png";
import cart_icon from "../../assets/cart_icon.png";
import user_icon from "../../assets/user_icon.png";
import "./Navbar.css";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = ({ onNavClick, onAuthClick, isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("");

  // This is the function to hold the search text
  const [searchTerm, setSearchTerm] = useState("");

  const [userName, setUserName] = useState("User"); 
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalCartItems } = useContext(ShopContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRole = localStorage.getItem('role');
    
    if (storedUser) {
        setUserName(storedUser.username || "User");
        setUserRole(storedRole);
    }
  }, [isLoggedIn]);

  // Keep underline in sync with current route; clear it on generic /shop
  useEffect(() => {
    const path = location.pathname;
    if (path === "/shop") {
      setActiveCategory("");
    } else if (path.startsWith("/shop/food")) {
      setActiveCategory("FOOD");
    } else if (path.startsWith("/shop/souvenirs")) {
      setActiveCategory("SOUVENIRS");
    } else if (path.startsWith("/shop/instruments")) {
      setActiveCategory("INSTRUMENTS");
    } else if (path.startsWith("/shop/tutorial")) {
      setActiveCategory("TUTORIAL");
    }
  }, [location.pathname]);

  // This is the function to toggle the SidebarOpen state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (categoryName, pageName) => {
    if (onNavClick) {
      onNavClick(pageName);
    }
  };

  const handleAuthClick = () => {
    if (onAuthClick) {
      onAuthClick();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);

      setSearchTerm(""); // Clear the search bar after searching
    }
  };

  const handleSidebarLink = (path) => {
      navigate(path);
      setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => onNavClick("home")}>
          <img src={logo} alt="Logo" />
          <p>Kulture</p>
        </div>
        <ul className="navbar-menu">
          <li onClick={() => handleMenuClick("FOOD", "/shop/food")}>
            FOOD {activeCategory === "FOOD" ? <hr /> : null}
          </li>
          <li onClick={() => handleMenuClick("SOUVENIRS", "/shop/souvenirs")}>
            SOUVENIRS {activeCategory === "SOUVENIRS" ? <hr /> : null}
          </li>
          <li
            onClick={() => handleMenuClick("INSTRUMENTS", "/shop/instruments")}
          >
            INSTRUMENTS {activeCategory === "INSTRUMENTS" ? <hr /> : null}
          </li>
          <li onClick={() => handleMenuClick("TUTORIAL", "/shop/tutorial")}>
            TUTORIAL {activeCategory === "TUTORIAL" ? <hr /> : null}
          </li>
        </ul>
        <form className="searchbar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <img src={search_icon} alt="Search Icon" />
          </button>
        </form>

        <div className="cart">
          <button
            onClick={() => {
              onNavClick("/cart");
            }}
          >
            <img src={cart_icon} alt="Cart Icon" />
          </button>
          <div className="cart-count">{getTotalCartItems()}</div>
        </div>

        <div className="auth-area">
          {isLoggedIn ? (
            <div className="user" onClick={toggleSidebar}>
              <img src={user_icon} alt="User Icon" />
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-signup-button" onClick={handleAuthClick}>
                Login/Signup
              </button>
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}>
          <div className="sidebar">
            <img src={user_icon} alt="User Icon" />
            <ul className="sidebar-links">
              {(userRole === 'SUPPLIER' || userRole === 'ADMIN') && (
                <li onClick={() => handleSidebarLink('/supplier')}>Supplier Dashboard</li>
              )}
              
              <li onClick={() => handleSidebarLink('/orders')}>My Orders</li>
              <li onClick={() => handleSidebarLink('/settings')}>Settings</li>
              <li className="logout-item" onClick={() => {
                if(onLogout) onLogout(); 
                setIsSidebarOpen(false);
              }}>
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
