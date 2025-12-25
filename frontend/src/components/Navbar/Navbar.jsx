import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo_default from "../../assets/kulture.png";
import logo_white from "../../assets/white_kulture.png";
import search_icon from "../../assets/search_icon.png";
import search_white from "../../assets/white_search.png";
import cart_icon from "../../assets/cart_icon.png";
import cart_white from "../../assets/white_cart.png";
import user_icon from "../../assets/user_icon.png";
import user_white from "../../assets/white_user.png";
import "./Navbar.css";
import Popup from "../Popup/Popup";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = ({ onNavClick, onAuthClick, isLoggedIn, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const { getTotalCartItems } = useContext(ShopContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");

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
      <div className={isHomePage ? "navbar navbar-home" : "navbar navbar-default"}>
        <div className="navbar-logo" onClick={() => onNavClick("home")}>
          <img src={isHomePage ? logo_white : logo_default} alt="Logo" />
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
            <img src={isHomePage ? search_white : search_icon} alt="Search Icon" />
          </button>
        </form>

        <div className="cart">
          <button
            className="cart-icon-btn"
            onClick={() => {
              onNavClick("/cart");
            }}
          >
            <img src={isHomePage ? cart_white : cart_icon} alt="Cart Icon" />
          </button>
          <div className="cart-count">{getTotalCartItems()}</div>
        </div>

        <div className="auth-area">
          {isLoggedIn ? (
            <div className="user" onClick={toggleSidebar}>
              <img src={isHomePage ? user_white : user_icon} alt="User Icon" />
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

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">

          <h3>Hello, {userName || "User"}</h3>
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>
        </div>

        <div className="sidebar-user-icon">
          <img src={user_icon} alt="User Profile" />
        </div>

        <ul className="sidebar-links">
          {userRole === "ADMIN" && (
            <li onClick={() => handleSidebarLink("/admin")}>Admin Dashboard</li>
          )}
          <li onClick={() => handleSidebarLink("/orders")}>My Orders</li>
          <li onClick={() => handleSidebarLink("/settings")}>Settings</li>
          <li
            className="logout-item"
            onClick={() => {
              if (onLogout) onLogout();
              setIsSidebarOpen(false);
              setPopup({ isOpen: true, message: "Logout successful", type: "success" });
              // Auto-close popup after 2 seconds
              setTimeout(() => {
                setPopup((prev) => ({ ...prev, isOpen: false }));
              }, 2000);
            }}
          >
            Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;