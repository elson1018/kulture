import React, { useState } from 'react'
import user_icon from '../../src/assets/user_icon.png'; 
import email_icon from '../../src/assets/email.png';
import padlock_icon from '../../src/assets/padlock.png';
import eye_closed_icon from '../../src/assets/eye_closed.png';
import eye_opened_icon from '../../src/assets/eye_opened.png';
import './Signup.css'

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className='signup-container'>
            <h2>Create Your <span>Kulture</span> Account</h2>
            <form action="#" className='signup-form'>
                <div className="input-wrapper">
                    <img src={user_icon} alt="User Name" className='email-icon'/> 
                    <input type="text" placeholder="Full Name" className="input-field" required/>
                </div>

                <div className="input-wrapper">
                    <img src={email_icon} alt="Email" className='email-icon'/>
                    <input type="email" placeholder="Email Address" className="input-field" required/>
                </div>

                <div className="input-wrapper"> 
                    <img src={padlock_icon} alt="Password" className='padlock-icon'/>
                    <input type={showPassword ? "text" : "password"} placeholder="Create Password" className="input-field" required/>
                    <img src={showPassword ? eye_opened_icon : eye_closed_icon} alt="Toggle Password Visibility" className='password-toggle-icon' onClick={togglePasswordVisibility}/>
                </div>

                <div className="agreement-wrapper">
                    <input type="checkbox" id="terms-agree" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} required/>
                    <label htmlFor="terms-agree">I agree to Kulture's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
                </div>

                <button className="signup-button" disabled={!agreedToTerms}>Sign Up</button>
            </form>

            <p className="login-text">Already have an account? <a href="#">Log In here</a></p>
        </div>
    )
}

export default Signup