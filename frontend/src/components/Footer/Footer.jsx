import React from 'react'
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
                    <li><a href="/shop/food">Foods</a></li>
                    <li><a href="/shop/souvenirs">Souvenirs</a></li>
                    <li><a href="/shop/instruments">Instruments</a></li>
                    <li><a href="/shop/dances">Dances</a></li>
                </ul>
            </div>

            {/* SUPPORT column */}
            <div className="footer-column product">
                <h4>SUPPORT</h4>
                <ul>
                    <li><a href="/help-centre">Help Centre</a></li>
                    <li><a href="/shipping">Shipping & Delivery</a></li>
                    <li><a href="/returns">Return & Refunds</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </div>

            {/* ABOUT KULTURE column */}
            <div className="footer-column products">
                <h4>ABOUT KULTURE</h4>
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/team">Meet Our Team</a></li>
                    <li><a href="/policies">Policies</a></li>
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
                        <img src={tiktok_icon} alt="Tik Tok"/>
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