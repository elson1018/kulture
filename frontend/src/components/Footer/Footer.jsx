import React from 'react'
import { Link } from 'react-router-dom'
import facebook_icon from '../../assets/facebook_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import tiktok_icon from '../../assets/tiktok_icon.png'
import './Footer.css'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                {/* PRODUCTS column */}
                <div className="footer-column products">
                    <h4>PRODUCTS</h4>
                    <ul>
                        <li><Link to="/shop/food">Foods</Link></li>
                        <li><Link to="/shop/souvenirs">Souvenirs</Link></li>
                        <li><Link to="/shop/instruments">Instruments</Link></li>
                        <li><Link to="/shop/tutorial">Tutorial</Link></li>
                    </ul>
                </div>

                {/* SUPPORT column */}
                <div className="footer-column product">
                    <h4>SUPPORT</h4>
                    <ul>
                        <li><Link to="/help-centre">Help Centre</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* ABOUT KULTURE column */}
                <div className="footer-column products">
                    <h4>ABOUT KULTURE</h4>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/team">Meet Our Team</Link></li>
                        <li><Link to="/policy">Policies</Link></li>
                    </ul>
                </div>

                {/* FOLLOW US column */}
                <div className="footer-column products">
                    <h4>FOLLOW US</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com/kulture" target="_blank" rel="noopener noreferrer">
                            <img src={facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://instagram.com/kulture" target="_blank" rel="noopener noreferrer">
                            <img src={instagram_icon} alt="Instagram" />
                        </a>
                        <a href="https://tiktok.com/kulture" target="_blank" rel="noopener noreferrer">
                            <img src={tiktok_icon} alt="Tik Tok" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 Kulture. All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer