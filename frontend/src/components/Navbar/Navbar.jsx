import React, { useState } from 'react'
import logo from '../../assets/xing.png' // will change a new icon later
import search_icon from '../../assets/search_icon.png'
import cart_icon from '../../assets/cart_icon.png'
import user_icon from '../../assets/user_icon.png'
import './Navbar.css'

const Navbar = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // This is the function to toggle the SidebarOpen state
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [menu, setMenu] = useState("FOOD");

    return ( 
        <>
            <div className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt="Logo" />
                    <p>Kulture</p>
                </div>
                <ul className="navbar-menu">
                    <li onClick={() => {setMenu("FOOD")}}>FOOD {menu === "FOOD" ? <hr /> : null}</li>
                    <li onClick={() => {setMenu("INSTRUMENTS")}}>INSTRUMENTS {menu === "INSTRUMENTS" ? <hr /> : null}</li>
                    <li onClick={() => {setMenu("SOUVENIRS")}}>SOUVENIRS {menu === "SOUVENIRS" ? <hr /> : null}</li>
                    <li onClick={() => {setMenu("DANCES")}}>DANCES {menu === "DANCES" ? <hr /> : null}</li>
                </ul>
                <div className="searchbar">
                    <input type='search' placeholder='Search'/>
                    <img src={search_icon} alt="Search Icon" />
                </div>
                <div className="cart">
                    <img src={cart_icon} alt="Cart Icon" />
                    <div className="cart-count">0</div>
                </div>
                <div className="user" onClick={toggleSidebar}>
                    <img src={user_icon} alt="User Icon" />
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