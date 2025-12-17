import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/xing.png' // will change a new icon later
import search_icon from '../../assets/search_icon.png'
import cart_icon from '../../assets/cart_icon.png'
import user_icon from '../../assets/user_icon.png'
import './Navbar.css'

const Navbar = ({onNavClick, onAuthClick, isLoggedIn, activePage}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [activeCategory, setActiveCategory] = useState("");

    // This is the function to hold the search text
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    // This is the function to toggle the SidebarOpen state
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (categoryName, pageName) => {
        setActiveCategory(categoryName);
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

    return ( 
        <>
            <div className='navbar'>
                <div className='navbar-logo' onClick={() => onNavClick('home')}>
                    <img src={logo} alt="Logo" />
                    <p>Kulture</p>
                </div>
                <ul className="navbar-menu">
                    <li onClick={() => handleMenuClick("FOOD", "/shop/food")}>FOOD {activeCategory === "FOOD" ? <hr /> : null}</li>
                    <li onClick={() => handleMenuClick("SOUVENIRS", "/shop/souvenirs")}>SOUVENIRS {activeCategory === "SOUVENIRS" ? <hr /> : null}</li>
                    <li onClick={() => handleMenuClick("INSTRUMENTS", "/shop/instruments")}>INSTRUMENTS {activeCategory === "INSTRUMENTS" ? <hr /> : null}</li>
                    <li onClick={() => handleMenuClick("TUTORIAL", "/shop/tutorial")}>TUTORIAL {activeCategory === "TUTORIAL" ? <hr /> : null}</li>
                </ul>
                <form className="searchbar" onSubmit={handleSearch}>
                    <input type='text' placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button type='submit' className='search-button'><img src={search_icon} alt="Search Icon" /></button>
                </form>
                <div className="cart">
                    <button onClick={() => {onNavClick("/checkout")}}><img src={cart_icon} alt="Cart Icon" /></button>
                    <div className="cart-count">0</div>
                </div>
              <div className="auth-area">
                    {isLoggedIn ? (
                        <div className="user" onClick={toggleSidebar}>
                            <img src={user_icon} alt="User Icon" />
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-signup-button" onClick={handleAuthClick}>Login/Signup</button>
                        </div>
                    )}
                </div>
            </div>

            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}>
                    <div className="sidebar">
                        <img src={user_icon} alt="User Icon" />
                        <ul>
                            <li>My Accounts</li>
                            <li>My Orders</li>
                            <li>Wishlist</li>
                            <li>Settings</li>
                            <li>Logout</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar